# 02 · STM32 DHT11 温湿度 + OLED 显示

> EmbedForge 生成结果示例（平台：STM32 HAL + GCC）

## 原始需求（一句话）

> STM32F103C8T6（BluePill）读取 DHT11 温湿度，软件 I2C 驱动 0.96 寸 SSD1306 OLED 显示，USART1 串口同时打印。

## 用 EmbedForge 复现

```bash
embedforge generate "STM32F103C8T6 读取 DHT11 温湿度，PB6/PB7 软件 I2C 驱动 SSD1306 OLED，USART1 打印" \
  --platform stm32 --out ./02-stm32-dht11-oled
```

## 引脚

| 引脚 | 信号 | 说明 |
| --- | --- | --- |
| PA0 | DHT11_DATA | 单总线，外接 4.7kΩ 上拉 |
| PB6 | OLED_SCL | 软件 I2C 时钟 |
| PB7 | OLED_SDA | 软件 I2C 数据 |
| PA9 / PA10 | USART1 TX/RX | 115200 串口 |

## 文件

```text
Makefile            arm-none-eabi-gcc 构建（模板骨架）
stm32_flash.ld      F103C8 链接脚本（模板骨架）
Core/Inc/main.h     引脚定义与声明
Core/Src/main.c     时钟/GPIO/USART 初始化 + 入口
Core/Src/app.c      DHT11 驱动、软件 I2C、SSD1306 驱动、主循环
```

## 构建与烧录

> 完整编译需要 STM32Cube HAL 库与启动文件：先用 STM32CubeMX 生成同型号基础工程，再用本示例的 `Core/` 覆盖。

```bash
make                              # 编译出 build/dht11-oled.bin
st-flash write build/dht11-oled.bin 0x08000000
```

## 实现要点

- DHT11：DWT 周期计数器做微秒级时序，单总线读 40bit + 校验和
- OLED：GPIO 开漏模拟 I2C，SSD1306 页寻址，内置精简 6×8 点阵
- 串口：`printf` 重定向到 USART1
