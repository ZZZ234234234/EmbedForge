#include "button.h"

#define DEBOUNCE_MS 20

void Button_Init(Button_HandleTypeDef *b, GPIO_TypeDef *port, uint16_t pin, uint8_t active_low) {
  b->port = port;
  b->pin = pin;
  b->active_low = active_low;
  b->state = 0;
  b->last_raw = 0;
  b->debounce_cnt = 0;
  b->pressed_flag = 0;

  GPIO_InitTypeDef g = {0};
  g.Pin = pin;
  g.Mode = active_low ? GPIO_MODE_INPUT : GPIO_MODE_INPUT;
  g.Pull = active_low ? GPIO_PULLUP : GPIO_PULLDOWN;
  HAL_GPIO_Init(port, &g);
}

void Button_Update(Button_HandleTypeDef *b) {
  uint8_t raw = (HAL_GPIO_ReadPin(b->port, b->pin) == GPIO_PIN_SET) ? 1 : 0;
  uint8_t down = b->active_low ? !raw : raw;

  if (down != b->last_raw) {
    b->debounce_cnt = 0;
    b->last_raw = down;
  } else {
    if (b->debounce_cnt < DEBOUNCE_MS) b->debounce_cnt++;
    if (b->debounce_cnt >= DEBOUNCE_MS && down != b->state) {
      b->state = down;
      if (down) b->pressed_flag = 1;
    }
  }
}

uint8_t Button_IsDown(Button_HandleTypeDef *b) { return b->state; }

uint8_t Button_WasPressed(Button_HandleTypeDef *b) {
  if (b->pressed_flag) { b->pressed_flag = 0; return 1; }
  return 0;
}
