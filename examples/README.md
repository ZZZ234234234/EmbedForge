# Examples · 生成结果示例

这里是 EmbedForge 生成工程的样例，展示「一句话需求 → 完整工程」的实际产出。每个示例都包含完整源码、构建文件、引脚表和复现命令。

| 示例 | 平台 | 内容 |
| --- | --- | --- |
| [01-arduino-blink-button](./01-arduino-blink-button) | Arduino / PlatformIO | LED 闪烁 + 按键消抖切换频率 + 串口 |
| [02-stm32-dht11-oled](./02-stm32-dht11-oled) | STM32 HAL + GCC | DHT11 单总线 + 软件 I2C 驱动 SSD1306 + USART1 |
| [03-micropython-weather](./03-micropython-weather) | MicroPython | DHT11 + OLED 温湿度站，异常自动重试 |

## 离线复现骨架（无需 API Key）

不调用 LLM 也可以生成对应平台的工程骨架（构建文件 + 目录结构）：

```bash
# 在仓库根目录构建 CLI
npm install && npm run build

# 生成某个平台的骨架
node dist/cli/index.js generate "DHT11 温湿度" --platform stm32 --skeleton-only --out ./out/stm32-demo
node dist/cli/index.js generate "LED 闪烁" --platform pico --skeleton-only --out ./out/pico-demo
```

接入 LLM 后，骨架中的 `main.c` / `main.py` 等源文件会由 AI 按你的需求自动生成，效果与本目录示例一致。
