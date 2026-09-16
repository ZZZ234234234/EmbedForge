#ifndef __BUTTON_H
#define __BUTTON_H

#include "stm32f1xx_hal.h"
#include <stdint.h>

typedef struct {
  GPIO_TypeDef *port;
  uint16_t pin;
  uint8_t active_low;   /* 1: 按下为低电平（上拉输入）；0: 按下为高电平 */
  uint8_t state;        /* 当前稳定状态 */
  uint8_t last_raw;     /* 上次原始采样 */
  uint16_t debounce_cnt;
  uint8_t pressed_flag; /* 按下沿标志，读取后自动清零 */
} Button_HandleTypeDef;

/** 初始化按键（GPIO 输入，内部上拉/下拉由 active_low 决定） */
void Button_Init(Button_HandleTypeDef *b, GPIO_TypeDef *port, uint16_t pin, uint8_t active_low);

/** 在主循环或 1ms 定时器中调用，执行消抖 */
void Button_Update(Button_HandleTypeDef *b);

/** 是否被按下（消抖后稳定状态） */
uint8_t Button_IsDown(Button_HandleTypeDef *b);

/** 是否发生一次按下沿（读取后自动清零，用于"按一次触发一次"） */
uint8_t Button_WasPressed(Button_HandleTypeDef *b);

#endif /* __BUTTON_H */
