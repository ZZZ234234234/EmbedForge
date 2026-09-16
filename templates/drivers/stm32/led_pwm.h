#ifndef __LED_PWM_H
#define __LED_PWM_H

#include "stm32f1xx_hal.h"
#include <stdint.h>

typedef struct {
  TIM_HandleTypeDef *htim;
  uint32_t channel;     /* TIM_CHANNEL_1 / _2 / _3 / _4 */
} LedPwm_HandleTypeDef;

/** 初始化 PWM LED（htim 需已配置 PWM，调用前先 MX_TIMx_Init） */
void LedPwm_Init(LedPwm_HandleTypeDef *l, TIM_HandleTypeDef *htim, uint32_t channel);

/** 设置占空比 0-100（0=灭，100=最亮） */
void LedPwm_SetDuty(LedPwm_HandleTypeDef *l, uint8_t percent);

/** 呼吸灯一步（在主循环周期性调用，返回当前占空比） */
uint8_t LedPwm_Breathe(LedPwm_HandleTypeDef *l, uint8_t step);

#endif /* __LED_PWM_H */
