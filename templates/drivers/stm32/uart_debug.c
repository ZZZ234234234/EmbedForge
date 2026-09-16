#include "uart_debug.h"
#include <stdio.h>

static UART_HandleTypeDef *s_huart = NULL;

void UartDebug_Init(UART_HandleTypeDef *huart) {
  s_huart = huart;
  setvbuf(stdout, NULL, _IONBF, 0); /* 禁用 stdout 缓冲，立等可见 */
}

/* ARM GCC / newlib printf 重定向 */
int _write(int fd, char *ptr, int len) {
  (void)fd;
  if (s_huart) {
    HAL_UART_Transmit(s_huart, (uint8_t *)ptr, (uint16_t)len, HAL_MAX_DELAY);
  }
  return len;
}
