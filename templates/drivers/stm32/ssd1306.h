#ifndef __SSD1306_H
#define __SSD1306_H

#include "stm32f1xx_hal.h"
#include <stdint.h>

#define SSD1306_WIDTH  128
#define SSD1306_HEIGHT 64

typedef struct {
  GPIO_TypeDef *scl_port; uint16_t scl_pin;
  GPIO_TypeDef *sda_port; uint16_t sda_pin;
  uint8_t buf[SSD1306_WIDTH * SSD1306_HEIGHT / 8];
  uint8_t cur_x, cur_y;
} SSD1306_HandleTypeDef;

/** 初始化 OLED（软件 I2C，任意 GPIO） */
void SSD1306_Init(SSD1306_HandleTypeDef *h,
                  GPIO_TypeDef *scl_port, uint16_t scl_pin,
                  GPIO_TypeDef *sda_port, uint16_t sda_pin);
void SSD1306_Clear(SSD1306_HandleTypeDef *h);
void SSD1306_SetCursor(SSD1306_HandleTypeDef *h, uint8_t col, uint8_t page);
void SSD1306_Putc(SSD1306_HandleTypeDef *h, char c);
void SSD1306_Puts(SSD1306_HandleTypeDef *h, const char *s);
/** 把显存刷新到 OLED（所有绘制后调用一次） */
void SSD1306_Update(SSD1306_HandleTypeDef *h);

#endif /* __SSD1306_H */
