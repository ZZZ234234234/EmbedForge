#ifndef __DHT11_H
#define __DHT11_H

#include "stm32f1xx_hal.h"
#include <stdint.h>

typedef struct {
  GPIO_TypeDef *port;
  uint16_t pin;
} DHT11_HandleTypeDef;

/** 初始化 DHT11 数据线（开漏输出，需外接 4.7k 上拉） */
void DHT11_Init(DHT11_HandleTypeDef *h, GPIO_TypeDef *port, uint16_t pin);

/**
 * 读取温湿度。返回 0 成功，非 0 失败（超时/校验错）。
 * temp 单位摄氏度，hum 单位 %RH。
 * 调用间隔不得小于 2 秒。
 */
int DHT11_Read(DHT11_HandleTypeDef *h, float *temp, float *hum);

#endif /* __DHT11_H */
