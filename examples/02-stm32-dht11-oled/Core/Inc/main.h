/**
 * main.h - 02-stm32-dht11-oled
 * STM32F103C8T6 + DHT11 + SSD1306 OLED（软件 I2C）+ USART1
 */
#ifndef MAIN_H
#define MAIN_H

#ifdef __cplusplus
extern "C" {
#endif

#include "stm32f1xx_hal.h"

/* ---------- 引脚分配 ---------- */
/* DHT11 数据线 */
#define DHT11_PORT      GPIOA
#define DHT11_PIN       GPIO_PIN_0

/* SSD1306 OLED 软件 I2C */
#define OLED_I2C_PORT   GPIOB
#define OLED_SCL_PIN    GPIO_PIN_6
#define OLED_SDA_PIN    GPIO_PIN_7
#define OLED_I2C_ADDR   (0x3C << 1)   /* 7 位地址 0x3C */

/* 应用层主循环（app.c） */
void App_Run(void);

/* 微秒延时（基于 DWT） */
void DWT_Init(void);
void DWT_DelayUs(uint32_t us);

/* 错误处理 */
void Error_Handler(void);

#ifdef __cplusplus
}
#endif

#endif /* MAIN_H */
