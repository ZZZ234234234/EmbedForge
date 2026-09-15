/**
 * main.c - 02-stm32-dht11-oled
 * STM32F103C8T6：DHT11 温湿度采集 + SSD1306 OLED 显示 + USART1 打印
 *
 * 说明：本文件为应用层入口；STM32Cube HAL 库与启动文件由工具链工程提供
 * （可用 STM32CubeMX 生成同型号基础工程后，用本文件替换 Core/Src/main.c）。
 */
#include "main.h"
#include <stdio.h>

static I2C_HandleTypeDef *g_noHardI2C = 0; /* OLED 使用软件 I2C，无需硬件 I2C */
static UART_HandleTypeDef huart1;

static void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_USART1_UART_Init(void);

int main(void)
{
  HAL_Init();
  SystemClock_Config();

  DWT_Init();
  MX_GPIO_Init();
  MX_USART1_UART_Init();

  printf("[dht11-oled] boot, SYSCLK=%lu Hz\r\n", HAL_RCC_GetSysClockFreq());

  /* 应用层初始化 + 主循环（app.c） */
  App_Run();

  while (1) {
    /* App_Run 内部自带循环；不会走到这里 */
  }
}

/* 72MHz：HSE 8MHz × 9（BluePill 常见晶振） */
static void SystemClock_Config(void)
{
  RCC_OscInitTypeDef osc = {0};
  RCC_ClkInitTypeDef clk = {0};

  osc.OscillatorType = RCC_OSCILLATORTYPE_HSE;
  osc.HSEState = RCC_HSE_ON;
  osc.HSEPredivValue = RCC_HSE_PREDIV_DIV1;
  osc.PLL.PLLState = RCC_PLL_ON;
  osc.PLL.PLLSource = RCC_PLLSOURCE_HSE;
  osc.PLL.PLLMUL = RCC_PLL_MUL9;
  if (HAL_RCC_OscConfig(&osc) != HAL_OK) Error_Handler();

  clk.ClockType = RCC_CLOCKTYPE_HCLK | RCC_CLOCKTYPE_SYSCLK |
                  RCC_CLOCKTYPE_PCLK1 | RCC_CLOCKTYPE_PCLK2;
  clk.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
  clk.AHBCLKDivider = RCC_SYSCLK_DIV1;
  clk.APB1CLKDivider = RCC_HCLK_DIV2;
  clk.APB2CLKDivider = RCC_HCLK_DIV1;
  if (HAL_RCC_ClockConfig(&clk, FLASH_LATENCY_2) != HAL_OK) Error_Handler();
}

static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef gpio = {0};

  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /* DHT11 数据线：开漏输出，外部 4.7k 上拉 */
  gpio.Pin = DHT11_PIN;
  gpio.Mode = GPIO_MODE_OUTPUT_OD;
  gpio.Pull = GPIO_PULLUP;
  gpio.Speed = GPIO_SPEED_FREQ_HIGH;
  HAL_GPIO_Init(DHT11_PORT, &gpio);
  HAL_GPIO_WritePin(DHT11_PORT, DHT11_PIN, GPIO_PIN_SET);

  /* 软件 I2C 引脚：开漏 + 上拉 */
  gpio.Pin = OLED_SCL_PIN | OLED_SDA_PIN;
  gpio.Mode = GPIO_MODE_OUTPUT_OD;
  gpio.Pull = GPIO_PULLUP;
  gpio.Speed = GPIO_SPEED_FREQ_HIGH;
  HAL_GPIO_Init(OLED_I2C_PORT, &gpio);
  HAL_GPIO_WritePin(OLED_I2C_PORT, OLED_SCL_PIN | OLED_SDA_PIN, GPIO_PIN_SET);

  (void)g_noHardI2C;
}

static void MX_USART1_UART_Init(void)
{
  huart1.Instance = USART1;
  huart1.Init.BaudRate = 115200;
  huart1.Init.WordLength = UART_WORDLENGTH_8B;
  huart1.Init.StopBits = UART_STOPBITS_1;
  huart1.Init.Parity = UART_PARITY_NONE;
  huart1.Init.Mode = UART_MODE_TX_RX;
  huart1.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart1.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart1) != HAL_OK) Error_Handler();
}

/* printf 重定向到 USART1 */
int fputc(int ch, FILE *f)
{
  (void)f;
  HAL_UART_Transmit(&huart1, (uint8_t *)&ch, 1, HAL_MAX_DELAY);
  return ch;
}

void Error_Handler(void)
{
  __disable_irq();
  while (1) { }
}
