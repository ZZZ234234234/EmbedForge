#ifndef __UART_DEBUG_H
#define __UART_DEBUG_H

#include "stm32f1xx_hal.h"

/** 绑定调试串口（huart 需已初始化，如 huart1）。之后 printf 即输出到该串口 */
void UartDebug_Init(UART_HandleTypeDef *huart);

#endif /* __UART_DEBUG_H */
