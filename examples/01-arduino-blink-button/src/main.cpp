/**
 * 01-arduino-blink-button
 * 板载 LED 闪烁，按键切换闪烁频率，串口输出当前状态。
 *
 * 接线：
 *   - 板载 LED（Uno: D13）
 *   - 按键：一端接 D2，另一端接 GND（使用内部上拉，按下为低电平）
 *
 * 由 EmbedForge 生成的示例工程（Arduino / PlatformIO）。
 */
#include <Arduino.h>

static const uint8_t LED_PIN = LED_BUILTIN;
static const uint8_t BUTTON_PIN = 2;

// 两档闪烁间隔（毫秒）
static const uint32_t INTERVAL_FAST = 200;
static const uint32_t INTERVAL_SLOW = 1000;
static const uint32_t DEBOUNCE_MS = 30;

static uint32_t intervalMs = INTERVAL_SLOW;
static bool ledOn = false;
static uint32_t lastToggleAt = 0;

// 按键消抖状态
static uint8_t lastRaw = HIGH;
static uint8_t stable = HIGH;
static uint32_t lastChangeAt = 0;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(115200);
  Serial.println(F("[blink-button] started, slow mode (1000 ms)"));
}

void loop() {
  const uint32_t now = millis();

  // 消抖：电平变化后稳定 DEBOUNCE_MS 才确认
  const uint8_t raw = digitalRead(BUTTON_PIN);
  if (raw != lastRaw) {
    lastChangeAt = now;
    lastRaw = raw;
  }
  if (now - lastChangeAt >= DEBOUNCE_MS && raw != stable) {
    stable = raw;
    if (stable == LOW) {
      // 确认的按下沿：切换频率
      intervalMs = (intervalMs == INTERVAL_SLOW) ? INTERVAL_FAST : INTERVAL_SLOW;
      Serial.print(F("[blink-button] interval -> "));
      Serial.print(intervalMs);
      Serial.println(F(" ms"));
    }
  }

  // 非阻塞闪烁
  if (now - lastToggleAt >= intervalMs) {
    lastToggleAt = now;
    ledOn = !ledOn;
    digitalWrite(LED_PIN, ledOn ? HIGH : LOW);
  }
}
