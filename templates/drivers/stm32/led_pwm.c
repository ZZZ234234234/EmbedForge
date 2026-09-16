#include "led_pwm.h"

void LedPwm_Init(LedPwm_HandleTypeDef *l, TIM_HandleTypeDef *htim, uint32_t channel) {
  l->htim = htim;
  l->channel = channel;
  HAL_TIM_PWM_Start(htim, channel);
  __HAL_TIM_SET_COMPARE(htim, channel, 0);
}

void LedPwm_SetDuty(LedPwm_HandleTypeDef *l, uint8_t percent) {
  if (percent > 100) percent = 100;
  uint32_t arr = __HAL_TIM_GET_AUTORELOAD(l->htim);
  uint32_t pulse = (uint32_t)((uint64_t)arr * percent / 100);
  __HAL_TIM_SET_COMPARE(l->htim, l->channel, pulse);
}

uint8_t LedPwm_Breathe(LedPwm_HandleTypeDef *l, uint8_t step) {
  static int8_t dir = 1;
  static uint8_t duty = 0;
  if (dir) {
    duty += step;
    if (duty >= 100) { duty = 100; dir = 0; }
  } else {
    duty = (duty > step) ? duty - step : 0;
    if (duty == 0) dir = 1;
  }
  LedPwm_SetDuty(l, duty);
  return duty;
}
