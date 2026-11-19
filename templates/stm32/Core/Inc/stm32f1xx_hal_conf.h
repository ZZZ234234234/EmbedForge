/**
  ******************************************************************************
  * @file    stm32f1xx_hal_conf.h
  * @brief   HAL 配置：决定哪些外设模块参与编译。
  *
  *          这里启用的模块必须与 Drivers/STM32F1xx_HAL_Driver/Src/ 下实际存在的
  *          源文件、以及 Makefile / CMakeLists.txt / platformio.ini / .uvprojx
  *          里参与编译的源文件三者一致，否则会出现：
  *            - 启用了但没编译对应 .c → 链接期 undefined reference to HAL_xxx_Init
  *            - 编译了但没启用        → 该 .c 因 HAL_xxx_MODULE_ENABLED 未定义而整体为空
  *
  *          当前随工程提供 19 个 HAL 源文件，因此下面启用 13 个模块。
  *          需要 CAN / RTC / SDIO / USB 等模块时，从 STM32CubeF1 固件包
  *          （Drivers/STM32F1xx_HAL_Driver/Src）复制对应 .c 进来，再打开这里对应的宏。
  ******************************************************************************
  */

#ifndef STM32F1xx_HAL_CONF_H
#define STM32F1xx_HAL_CONF_H

#ifdef __cplusplus
extern "C" {
#endif

/* ========================================================================== */
/* Module Selection                                                           */
/* ========================================================================== */

#define HAL_MODULE_ENABLED

/* --- 已随模板提供源文件的模块 --- */
#define HAL_ADC_MODULE_ENABLED
#define HAL_CORTEX_MODULE_ENABLED
#define HAL_DMA_MODULE_ENABLED
#define HAL_EXTI_MODULE_ENABLED
#define HAL_FLASH_MODULE_ENABLED
#define HAL_GPIO_MODULE_ENABLED
#define HAL_I2C_MODULE_ENABLED
#define HAL_PWR_MODULE_ENABLED
#define HAL_RCC_MODULE_ENABLED
#define HAL_SPI_MODULE_ENABLED
#define HAL_TIM_MODULE_ENABLED
#define HAL_UART_MODULE_ENABLED
#define HAL_USART_MODULE_ENABLED

/* --- 未提供源文件的模块：需要时从固件包补 .c 后再取消注释 ---
#define HAL_CAN_MODULE_ENABLED
#define HAL_CEC_MODULE_ENABLED
#define HAL_CRC_MODULE_ENABLED
#define HAL_DAC_MODULE_ENABLED
#define HAL_ETH_MODULE_ENABLED
#define HAL_HCD_MODULE_ENABLED
#define HAL_I2S_MODULE_ENABLED
#define HAL_IRDA_MODULE_ENABLED
#define HAL_IWDG_MODULE_ENABLED
#define HAL_NAND_MODULE_ENABLED
#define HAL_NOR_MODULE_ENABLED
#define HAL_PCCARD_MODULE_ENABLED
#define HAL_PCD_MODULE_ENABLED
#define HAL_RTC_MODULE_ENABLED
#define HAL_SD_MODULE_ENABLED
#define HAL_SMARTCARD_MODULE_ENABLED
#define HAL_SRAM_MODULE_ENABLED
#define HAL_WWDG_MODULE_ENABLED
*/

/* ========================================================================== */
/* Oscillator Values (Hz)                                                     */
/* ========================================================================== */

#if !defined(HSE_VALUE)
#define HSE_VALUE               8000000U  /* BluePill 常见 8MHz 晶振；若为 12MHz 请改这里 */
#endif

#if !defined(HSE_STARTUP_TIMEOUT)
#define HSE_STARTUP_TIMEOUT     100U
#endif

#if !defined(HSI_VALUE)
#define HSI_VALUE               8000000U
#endif

#if !defined(LSI_VALUE)
#define LSI_VALUE               40000U
#endif

#if !defined(LSE_VALUE)
#define LSE_VALUE               32768U
#endif

#if !defined(LSE_STARTUP_TIMEOUT)
#define LSE_STARTUP_TIMEOUT     5000U
#endif

/* ========================================================================== */
/* System Configuration                                                       */
/* ========================================================================== */

#define VDD_VALUE                    3300U
#define TICK_INT_PRIORITY            0U
#define USE_RTOS                     0U
#define PREFETCH_ENABLE              1U

#define USE_HAL_ADC_REGISTER_CALLBACKS   0U
#define USE_HAL_CAN_REGISTER_CALLBACKS   0U
#define USE_HAL_CEC_REGISTER_CALLBACKS   0U
#define USE_HAL_DAC_REGISTER_CALLBACKS   0U
#define USE_HAL_ETH_REGISTER_CALLBACKS   0U
#define USE_HAL_HCD_REGISTER_CALLBACKS   0U
#define USE_HAL_I2C_REGISTER_CALLBACKS   0U
#define USE_HAL_I2S_REGISTER_CALLBACKS   0U
#define USE_HAL_MMC_REGISTER_CALLBACKS   0U
#define USE_HAL_NAND_REGISTER_CALLBACKS  0U
#define USE_HAL_NOR_REGISTER_CALLBACKS   0U
#define USE_HAL_PCCARD_REGISTER_CALLBACKS 0U
#define USE_HAL_PCD_REGISTER_CALLBACKS   0U
#define USE_HAL_RTC_REGISTER_CALLBACKS   0U
#define USE_HAL_SD_REGISTER_CALLBACKS    0U
#define USE_HAL_SMARTCARD_REGISTER_CALLBACKS 0U
#define USE_HAL_IRDA_REGISTER_CALLBACKS  0U
#define USE_HAL_SRAM_REGISTER_CALLBACKS  0U
#define USE_HAL_SPI_REGISTER_CALLBACKS   0U
#define USE_HAL_TIM_REGISTER_CALLBACKS   0U
#define USE_HAL_UART_REGISTER_CALLBACKS  0U
#define USE_HAL_USART_REGISTER_CALLBACKS 0U
#define USE_HAL_WWDG_REGISTER_CALLBACKS  0U

/* ========================================================================== */
/* Includes                                                                   */
/* ========================================================================== */

#ifdef HAL_RCC_MODULE_ENABLED
#include "stm32f1xx_hal_rcc.h"
#endif

#ifdef HAL_GPIO_MODULE_ENABLED
#include "stm32f1xx_hal_gpio.h"
#endif

#ifdef HAL_EXTI_MODULE_ENABLED
#include "stm32f1xx_hal_exti.h"
#endif

#ifdef HAL_DMA_MODULE_ENABLED
#include "stm32f1xx_hal_dma.h"
#endif

#ifdef HAL_CORTEX_MODULE_ENABLED
#include "stm32f1xx_hal_cortex.h"
#endif

#ifdef HAL_ADC_MODULE_ENABLED
#include "stm32f1xx_hal_adc.h"
#endif

#ifdef HAL_FLASH_MODULE_ENABLED
#include "stm32f1xx_hal_flash.h"
#endif

#ifdef HAL_I2C_MODULE_ENABLED
#include "stm32f1xx_hal_i2c.h"
#endif

#ifdef HAL_PWR_MODULE_ENABLED
#include "stm32f1xx_hal_pwr.h"
#endif

#ifdef HAL_SPI_MODULE_ENABLED
#include "stm32f1xx_hal_spi.h"
#endif

#ifdef HAL_TIM_MODULE_ENABLED
#include "stm32f1xx_hal_tim.h"
#endif

#ifdef HAL_UART_MODULE_ENABLED
#include "stm32f1xx_hal_uart.h"
#endif

#ifdef HAL_USART_MODULE_ENABLED
#include "stm32f1xx_hal_usart.h"
#endif

/* ========================================================================== */
/* Assert                                                                     */
/* ========================================================================== */

/* #define USE_FULL_ASSERT    1U */

#ifdef USE_FULL_ASSERT
#define assert_param(expr) ((expr) ? (void)0U : assert_failed((uint8_t *)__FILE__, __LINE__))
void assert_failed(uint8_t *file, uint32_t line);
#else
#define assert_param(expr) ((void)0U)
#endif

#ifdef __cplusplus
}
#endif

#endif /* STM32F1xx_HAL_CONF_H */
