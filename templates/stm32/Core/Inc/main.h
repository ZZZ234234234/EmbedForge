#ifndef __MAIN_H
#define __MAIN_H

#include "stm32f1xx_hal.h"

/* 系统时钟配置（72MHz HSE） */
void SystemClock_Config(void);
/* GPIO 初始化 */
void MX_GPIO_Init(void);
/* 错误处理（死循环，可在此加断点） */
void Error_Handler(void);

#endif /* __MAIN_H */
