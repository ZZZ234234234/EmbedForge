#include "dht11.h"

/* ===== 微秒延时（DWT 周期计数器） ===== */
static void DWT_Init(void) {
  CoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;
  DWT->CYCCNT = 0;
  DWT->CTRL |= DWT_CTRL_CYCCNTENA_Msk;
}
static void delay_us(uint32_t us) {
  uint32_t start = DWT->CYCCNT;
  uint32_t ticks = us * (SystemCoreClock / 1000000U);
  while ((DWT->CYCCNT - start) < ticks) { __NOP(); }
}

/* ===== 引脚方向切换 ===== */
static void pin_output(DHT11_HandleTypeDef *h) {
  GPIO_InitTypeDef g = {0};
  g.Pin = h->pin;
  g.Mode = GPIO_MODE_OUTPUT_OD;
  g.Speed = GPIO_SPEED_FREQ_HIGH;
  HAL_GPIO_Init(h->port, &g);
}
static void pin_input(DHT11_HandleTypeDef *h) {
  GPIO_InitTypeDef g = {0};
  g.Pin = h->pin;
  g.Mode = GPIO_MODE_INPUT;
  g.Pull = GPIO_NOPULL;
  HAL_GPIO_Init(h->port, &g);
}

void DHT11_Init(DHT11_HandleTypeDef *h, GPIO_TypeDef *port, uint16_t pin) {
  h->port = port;
  h->pin = pin;
  DWT_Init();
  pin_output(h);
  HAL_GPIO_WritePin(h->port, h->pin, GPIO_PIN_SET);
}

/* 等待引脚变到指定电平，超时返回 -1 */
static int wait_level(DHT11_HandleTypeDef *h, GPIO_PinState level, uint32_t timeout_us) {
  uint32_t start = DWT->CYCCNT;
  uint32_t ticks = timeout_us * (SystemCoreClock / 1000000U);
  while (HAL_GPIO_ReadPin(h->port, h->pin) != level) {
    if ((DWT->CYCCNT - start) > ticks) return -1;
  }
  return 0;
}

int DHT11_Read(DHT11_HandleTypeDef *h, float *temp, float *hum) {
  uint8_t data[5] = {0};

  /* 主机起始信号：拉低 >=18ms */
  pin_output(h);
  HAL_GPIO_WritePin(h->port, h->pin, GPIO_PIN_RESET);
  HAL_Delay(20);
  HAL_GPIO_WritePin(h->port, h->pin, GPIO_PIN_SET);
  delay_us(30);

  /* 切换输入，等待从机响应 */
  pin_input(h);
  if (wait_level(h, GPIO_PIN_RESET, 100) != 0) return 1; /* 从机拉低 80us */
  if (wait_level(h, GPIO_PIN_SET, 100) != 0) return 2;   /* 从机拉高 80us */
  if (wait_level(h, GPIO_PIN_RESET, 100) != 0) return 3;  /* 准备传输 */

  /* 读 40 位 */
  for (int i = 0; i < 40; i++) {
    if (wait_level(h, GPIO_PIN_SET, 80) != 0) return 4;
    delay_us(40); /* 26-28us 为 0，70us 为 1；40us 处采样 */
    if (HAL_GPIO_ReadPin(h->port, h->pin) == GPIO_PIN_SET) {
      data[i / 8] |= (uint8_t)(1 << (7 - (i % 8)));
    }
    if (wait_level(h, GPIO_PIN_RESET, 80) != 0) return 5;
  }

  /* 校验 */
  if (data[4] != (uint8_t)(data[0] + data[1] + data[2] + data[3])) return 6;

  *hum = (float)data[0] + (float)data[1] * 0.1f;
  *temp = (float)data[2] + (float)data[3] * 0.1f;
  return 0;
}
