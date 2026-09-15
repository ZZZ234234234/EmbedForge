---
name: stm32-gpio-clock
description: STM32 GPIO 配置与时钟树要点（RCC 使能、模式选择、速度等级、常见坑）
triggers: stm32, gpio, 时钟, rcc, hal_gpio, 引脚
---

# STM32 GPIO 与时钟配置要点

## 时钟树（先开时钟再配外设，顺序不能反）
- 所有外设使用前必须先使能对应总线时钟：GPIOx/AFIO/DMA 在 **AHB/APB2**（RCC_APB2PeriphClockCmd 或 `__HAL_RCC_GPIOx_CLK_ENABLE`），TIM/USART/SPI/I2C 大多在 **APB1**。
- 使能后立即配置，不要在使能与配置之间插入长时间延时。
- HSE 外部晶振启动失败要检测 `HSEStatus`，不要假设一定起振；超时降级 HSI 是量产必备。

## GPIO 模式选择
| 场景 | 模式 | 备注 |
| --- | --- | --- |
| 输出（LED/控制） | 推挽输出 Output_PP | 需要灌/拉大电流时查数据手册 IO 能力（一般 20~25mA） |
| 总线/开漏器件 | 开漏输出 Output_OD | I2C 类需要外部上拉 |
| 数字输入 | 上拉/下拉输入 | 悬空引脚绝不浮空配置 |
| 模拟 | Analog Mode | ADC/DAC 引脚必须配 Analog，否则采样噪声大 |
| 外设复用 | AF_PP / AF_OD | HAL 下用 `HAL_GPIO_Init` + `GPIO_AFx_xxx` |

## 易错点（资深经验）
1. **速度等级**：高速信号（SPI>10MHz、PWM 高频）选 HIGH/VERY_HIGH，普通 LED 用 LOW 即可，速度越高 EMC 越差。
2. **JTAG/SWD 引脚**（PA13/PA14/PA15/PB3/PB4）默认是调试口，复用前确认是否需要保留调试能力，至少保留 SWD。
3. **BOOT 引脚**（BOOT0/BOOT1）决定启动模式，PCB 上要有跳线或下拉。
4. F1 系列重映射（AFIO Remap）与 F4/G0 系列的 AF 编号体系完全不同，不要混用写法。
5. 读输入用 IDR/`HAL_GPIO_ReadPin`；`HAL_GPIO_WritePin` 操作 BSRR 原子置位，比读改写 ODR 安全（ISR 与主循环同时操作同一端口时尤其重要）。
