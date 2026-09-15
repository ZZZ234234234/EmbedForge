---
name: stm32-uart
description: UART 串口驱动与调试要点（波特率、中断/DMA 收发、printf 重定向、协议帧）
triggers: uart, usart, 串口, rs232, rs485, printf, 波特率
---

# UART 串口开发要点

## 初始化检查清单
- 波特率误差：APB 时钟除不尽时误差 >2% 会丢码，先算 `USARTDIV` 确认（16MHz 主频 115200 误差约 0.02% 可接受；用 HSI 时注意校准）。
- 字长/停止位/校验要与对端一致；8N1 是默认，RS485 半双工要处理 DE 引脚方向切换（发送前置高、发完 TC 中断置低）。
- 使能中断前先清标志（ORE/NE/FE），否则一开中断就进死循环。

## 收发模型选型
1. **调试打印**：阻塞 `HAL_UART_Transmit` 足够，加超时。
2. **不定长接收**：空闲中断 IDLE + DMA（`HAL_UARTEx_ReceiveToIdle_DMA`）是标准做法；纯中断逐字节收要处理 ORE 溢出。
3. **协议帧解析**：环形缓冲区 + 状态机解析，**绝不在 ISR 里做解析**，只做入队。

## printf 重定向（Keil/GCC）
- GCC：重写 `_write`；Keil MicroLib：重写 `fputc`。都要 `#include <stdio.h>` 并注意缓冲。
- 浮点打印 `%f` 在 nano libc 需要 `-u _printf_float`，否则打印不出来。

## 资深经验
- TX 用 `HAL_UART_Transmit_IT/DMA` 时注意 HAL 锁（`__HAL_LOCK`）冲突：主循环与 ISR 同时发起会返回 HAL_BUSY，要用完成标志串行化。
- RS485 总线要有终端电阻（120Ω）与失败重发机制；Modbus RTU 帧间隔 3.5 字符时间用定时器判定。
- 串口日志别在中断里打（阻塞+重入），改用缓冲区主循环刷出。
