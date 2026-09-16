```c
/**
  ******************************************************************************
  * @file    stm32f1xx_hal_rcc.h
  * @brief   Header file of RCC HAL module.
  ******************************************************************************
  * @attention
  *
  * Copyright (c) 2016 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  ******************************************************************************
  */

/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __STM32F1xx_HAL_RCC_H
#define __STM32F1xx_HAL_RCC_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include "stm32f1xx_hal_def.h"

/** @addtogroup STM32F1xx_HAL_Driver
  * @{
  */

/** @addtogroup RCC
  * @{
  */

/* Exported types ------------------------------------------------------------*/

/** @defgroup RCC_Exported_Types RCC Exported Types
  * @{
  */

/**
  * @brief  RCC PLL configuration structure definition
  */
typedef struct
{
  uint32_t PLLState;   /*!< The new state of the PLL.
                            This parameter can be a value of @ref RCC_PLL_Config                      */

  uint32_t PLLSource;  /*!< RCC_PLLSource: PLL entry clock source.
                            This parameter must be a value of @ref RCC_PLL_Clock_Source               */

  uint32_t PLLMUL;     /*!< PLLMUL: Multiplication factor for PLL VCO input clock
                            This parameter must be a value of @ref RCCEx_PLL_Multiplication_Factor */

} RCC_PLLInitTypeDef;

/**
  * @brief  RCC System, AHB and APB busses clock configuration structure definition
  */
typedef struct
{
  uint32_t ClockType;             /*!< The clock to be configured.
                                       This parameter can be a value of @ref RCC_System_Clock_Type      */

  uint32_t SYSCLKSource;          /*!< The clock source (SYSCLKS) used as system clock.
                                       This parameter can be a value of @ref RCC_System_Clock_Source    */

  uint32_t AHBCLKDivider;         /*!< The AHB clock (HCLK) divider. This clock is derived from the system clock (SYSCLK).
                                       This parameter can be a value of @ref RCC_AHB_Clock_Source       */

  uint32_t APB1CLKDivider;        /*!< The APB1 clock (PCLK1) divider. This clock is derived from the AHB clock (HCLK).
                                       This parameter can be a value of @ref RCC_APB1_APB2_Clock_Source */

  uint32_t APB2CLKDivider;        /*!< The APB2 clock (PCLK2) divider. This clock is derived from the AHB clock (HCLK).
                                       This parameter can be a value of @ref RCC_APB1_APB2_Clock_Source */

} RCC_ClkInitTypeDef;

/**
  * @}
  */

/* Exported constants --------------------------------------------------------*/

/** @defgroup RCC_Exported_Constants RCC Exported Constants
  * @{
  */

/** @defgroup RCC_HSE_Configuration RCC HSE Configuration
  * @{
  */
#define RCC_HSE_OFF                      0x00000000U                     /*!< HSE clock deactivation */
#define RCC_HSE_ON                       RCC_CR_HSEON                    /*!< HSE clock activation */
#define RCC_HSE_BYPASS                   ((uint32_t)(RCC_CR_HSEBYP | RCC_CR_HSEON)) /*!< External clock source for HSE clock */
/**
  * @}
  */

/** @defgroup RCC_LSE_Configuration RCC LSE Configuration
  * @{
  */
#define RCC_LSE_OFF                      0x00000000U                     /*!< LSE clock deactivation */
#define RCC_LSE_ON                       RCC_BDCR_LSEON                  /*!< LSE clock activation */
#define RCC_LSE_BYPASS                   ((uint32_t)(RCC_BDCR_LSEBYP | RCC_BDCR_LSEON)) /*!< External clock source for LSE clock */
/**
  * @}
  */

/** @defgroup RCC_HSI_Configuration RCC HSI Configuration
  * @{
  */
#define RCC_HSI_OFF                      0x00000000U                     /*!< HSI clock deactivation */
#define RCC_HSI_ON                       RCC_CR_HSION                    /*!< HSI clock activation */

#define RCC_HSICALIBRATION_DEFAULT       0x10U                           /*!< Default HSI calibration trimming value */
/**
  * @}
  */

/** @defgroup RCC_LSI_Configuration RCC LSI Configuration
  * @{
  */
#define RCC_LSI_OFF                      0x00000000U                     /*!< LSI clock deactivation */
#define RCC_LSI_ON                       RCC_CSR_LSION                   /*!< LSI clock activation */
/**
  * @}
  */

/** @defgroup RCC_PLL_Config RCC PLL Config
  * @{
  */
#define RCC_PLL_NONE                     0x00000000U                     /*!< PLL is not configured */
#define RCC_PLL_OFF                      0x00000001U                     /*!< PLL deactivation */
#define RCC_PLL_ON                       0x00000002U                     /*!< PLL activation */
/**
  * @}
  */

/** @defgroup RCC_System_Clock_Type RCC System Clock Type
  * @{
  */
#define RCC_CLOCKTYPE_SYSCLK             0x00000001U                     /*!< SYSCLK to configure */
#define RCC_CLOCKTYPE_HCLK               0x00000002U                     /*!< HCLK to configure */
#define RCC_CLOCKTYPE_PCLK1              0x00000004U                     /*!< PCLK1 to configure */
#define RCC_CLOCKTYPE_PCLK2              0x00000008U                     /*!< PCLK2 to configure */
/**
  * @}
  */

/** @defgroup RCC_System_Clock_Source RCC System Clock Source
  * @{
  */
#define RCC_SYSCLKSOURCE_HSI             RCC_CFGR_SW_HSI                 /*!< HSI selected as system clock */
#define RCC_SYSCLKSOURCE_HSE             RCC_CFGR_SW_HSE                 /*!< HSE selected as system clock */
#define RCC_SYSCLKSOURCE_PLLCLK          RCC_CFGR_SW_PLL                 /*!< PLL selected as system clock */
/**
  * @}
  */

/** @defgroup RCC_System_Clock_Source_Status RCC System Clock Source Status
  * @{
  */
#define RCC_SYSCLKSOURCE_STATUS_HSI      RCC_CFGR_SWS_HSI                /*!< HSI used as system clock */
#define RCC_SYSCLKSOURCE_STATUS_HSE      RCC_CFGR_SWS_HSE                /*!< HSE used as system clock */
#define RCC_SYSCLKSOURCE_STATUS_PLLCLK   RCC_CFGR_SWS_PLL                /*!< PLL used as system clock */
/**
  * @}
  */

/** @defgroup RCC_AHB_Clock_Source RCC AHB Clock Source
  * @{
  */
#define RCC_SYSCLK_DIV1                  RCC_CFGR_HPRE_DIV1              /*!< SYSCLK not divided */
#define RCC_SYSCLK_DIV2                  RCC_CFGR_HPRE_DIV2              /*!< SYSCLK divided by 2 */
#define RCC_SYSCLK_DIV4                  RCC_CFGR_HPRE_DIV4              /*!< SYSCLK divided by 4 */
#define RCC_SYSCLK_DIV8                  RCC_CFGR_HPRE_DIV8              /*!< SYSCLK divided by 8 */
#define RCC_SYSCLK_DIV16                 RCC_CFGR_HPRE_DIV16             /*!< SYSCLK divided by 16 */
#define RCC_SYSCLK_DIV64                 RCC_CFGR_HPRE_DIV64             /*!< SYSCLK divided by 64 */
#define RCC_SYSCLK_DIV128                RCC_CFGR_HPRE_DIV128            /*!< SYSCLK divided by 128 */
#define RCC_SYSCLK_DIV256                RCC_CFGR_HPRE_DIV256            /*!< SYSCLK divided by 256 */
#define RCC_SYSCLK_DIV512                RCC_CFGR_HPRE_DIV512            /*!< SYSCLK divided by 512 */
/**
  * @}
  */

/** @defgroup RCC_APB1_APB2_Clock_Source RCC APB1 APB2 Clock Source
  * @{
  */
#define RCC_HCLK_DIV1                    RCC_CFGR_PPRE1_DIV1             /*!< HCLK not divided */
#define RCC_HCLK_DIV2                    RCC_CFGR_PPRE1_DIV2             /*!< HCLK divided by 2 */
#define RCC_HCLK_DIV4                    RCC_CFGR_PPRE1_DIV4             /*!< HCLK divided by 4 */
#define RCC_HCLK_DIV8                    RCC_CFGR_PPRE1_DIV8             /*!< HCLK divided by 8 */
#define RCC_HCLK_DIV16                   RCC_CFGR_PPRE1_DIV16            /*!< HCLK divided by 16 */
/**
  * @}
  */

/** @defgroup RCC_Interrupt RCC Interrupt
  * @{
  */
#define RCC_IT_LSIRDY                    RCC_CIR_LSIRDYF                 /*!< LSI Ready Interrupt flag */
#define RCC_IT_LSERDY                    RCC_CIR_LSERDYF                 /*!< LSE Ready Interrupt flag */
#define RCC_IT_HSIRDY                    RCC_CIR_HSIRDYF                 /*!< HSI Ready Interrupt flag */
#define RCC_IT_HSERDY                    RCC_CIR_HSERDYF                 /*!< HSE Ready Interrupt flag */
#define RCC_IT_PLLRDY                    RCC_CIR_PLLRDYF                 /*!< PLL Ready Interrupt flag */
#define RCC_IT_CSS                       RCC_CIR_CSSF                    /*!< Clock Security System Interrupt flag */
/**
  * @}
  */

/** @defgroup RCC_Flag RCC Flag
  * @{
  */
#define RCC_FLAG_HSIRDY                  ((uint8_t)((RCC_CSR_HSIRDY >> 5U) | 0x20U)) /*!< Internal High Speed clock ready flag */
#define RCC_FLAG_HSERDY                  ((uint8_t)((RCC_CSR_HSERDY >> 5U) | 0x20U)) /*!< External High Speed clock ready flag */
#define RCC_FLAG_PLLRDY                  ((uint8_t)((RCC_CSR_PLLRDY >> 5U) | 0x20U)) /*!< PLL clock ready flag */
#define RCC_FLAG_LSERDY                  ((uint8_t)((RCC_CSR_LSERDY >> 5U) | 0x20U)) /*!< External Low Speed clock ready flag */
#define RCC_FLAG_LSIRDY                  ((uint8_t)((RCC_CSR_LSIRDY >> 5U) | 0x20U)) /*!< Internal Low Speed clock ready flag */
#define RCC_FLAG_PINRST                  ((uint8_t)0x00U)                /*!< PIN reset flag */
#define RCC_FLAG_PORRST                  ((uint8_t)0x01U)                /*!< POR/PDR reset flag */
#define RCC_FLAG_SFTRST                  ((uint8_t)0x02U)                /*!< Software reset flag */
#define RCC_FLAG_IWDGRST                 ((uint8_t)0x03U)                /*!< Independent Watchdog reset flag */
#define RCC_FLAG_WWDGRST                 ((uint8_t)0x04U)                /*!< Window Watchdog reset flag */
#define RCC_FLAG_LPWRRST                 ((uint8_t)0x05U)                /*!< Low Power reset flag */
/**
  * @}
  */

/** @defgroup RCC_Clock_Security_System_Configuration RCC Clock Security System Configuration
  * @{
  */
#define RCC_CLOCKSSECURITYSYSTEM_OFF     0x00000000U                     /*!< Clock Security System deactivation */
#define RCC_CLOCKSSECURITYSYSTEM_ON      RCC_CR_CSSON                    /*!< Clock Security System activation */
/**
  * @}
  */

/** @defgroup RCC_Oscillator_Type RCC Oscillator Type
  * @{
  */
#define RCC_OSCILLATORTYPE_NONE          0x00000000U                     /*!< Oscillator not configured */
#define RCC_OSCILLATORTYPE_HSE           RCC_CR_HSEON                    /*!< HSE oscillator */
#define RCC_OSCILLATORTYPE_HSI           RCC_CR_HSION                    /*!< HSI oscillator */
#define RCC_OSCILLATORTYPE_LSE           RCC_BDCR_LSEON                  /*!< LSE oscillator */
#define RCC_OSCILLATORTYPE_LSI           RCC_CSR_LSION                   /*!< LSI oscillator */
/**
  * @}
  */

/** @defgroup RCC_HSE_Config RCC HSE Config
  * @{
  */
#define RCC_HSE_ON                       RCC_CR_HSEON                    /*!< HSE clock activation */
#define RCC_HSE_BYPASS                   ((uint32_t)(RCC_CR_HSEBYP | RCC_CR_HSEON)) /*!< External clock source for HSE clock */
/**
  * @}
  */

/** @defgroup RCC_LSE_Config RCC LSE Config
  * @{
  */
#define RCC_LSE_ON                       RCC_BDCR_LSEON                  /*!< LSE clock activation */
#define RCC_LSE_BYPASS                   ((uint32_t)(RCC_BDCR_LSEBYP | RCC_BDCR_LSEON)) /*!< External clock source for LSE clock */
/**
  * @}
  */

/** @defgroup RCC_PLL_Clock_Source RCC PLL Clock Source
  * @{
  */
#define RCC_PLLSOURCE_HSI_DIV2           RCC_CFGR_PLLSRC_HSI_DIV2        /*!< HSI clock divided by 2 selected as PLL entry clock source */
#define RCC_PLLSOURCE_HSE_DIV1           RCC_CFGR_PLLSRC_HSE_PREDIV      /*!< HSE clock selected as PLL entry clock source */
#define RCC_PLLSOURCE_HSE_DIV2           ((uint32_t)(RCC_CFGR_PLLSRC_HSE_PREDIV | RCC_CFGR_PLLXTPRE_HSE_DIV2)) /*!< HSE clock divided by 2 selected as PLL entry clock source */
/**
  * @}
  */

/** @defgroup RCC_PLL_Multiplication_Factor RCC PLL Multiplication Factor
  * @{
  */
#define RCC_PLL_MUL2                     RCC_CFGR_PLLMULL2
#define RCC_PLL_MUL3                     RCC_CFGR_PLLMULL3
#define RCC_PLL_MUL4                     RCC_CFGR_PLLMULL4
#define RCC_PLL_MUL5                     RCC_CFGR_PLLMULL5
#define RCC_PLL_MUL6                     RCC_CFGR_PLLMULL6
#define RCC_PLL_MUL7                     RCC_CFGR_PLLMULL7
#define RCC_PLL_MUL8                     RCC_CFGR_PLLMULL8
#define RCC_PLL_MUL9                     RCC_CFGR_PLLMULL9
#define RCC_PLL_MUL10                    RCC_CFGR_PLLMULL10
#define RCC_PLL_MUL11                    RCC_CFGR_PLLMULL11
#define RCC_PLL_MUL12                    RCC_CFGR_PLLMULL12
#define RCC_PLL_MUL13                    RCC_CFGR_PLLMULL13
#define RCC_PLL_MUL14                    RCC_CFGR_PLLMULL14
#define RCC_PLL_MUL15                    RCC_CFGR_PLLMULL15
#define RCC_PLL_MUL16                    RCC_CFGR_PLLMULL16
/**
  * @}
  */

/** @defgroup RCC_MCO_Index RCC MCO Index
  * @{
  */
#define RCC_MCO1                         0x00000000U
#define RCC_MCO                          RCC_MCO1                        /*!< MCO1 to be compliant with other families with 2 MCOs*/
/**
  * @}
  */

/** @defgroup RCC_MCOx_Clock_Prescaler RCC MCOx Clock Prescaler
  * @{
  */
#define RCC_MCODIV_1                     RCC_CFGR_MCO_NOCLOCK
#define RCC_MCODIV_2                     RCC_CFGR_MCO_SYSCLK
#define RCC_MCODIV_3                     RCC_CFGR_MCO_HSI
#define RCC_MCODIV_4                     RCC_CFGR_MCO_HSE
#define RCC_MCODIV_5                     RCC_CFGR_MCO_PLLCLK_DIV2
/**
  * @}
  */

/** @defgroup RCC_RTC_Clock_Source RCC RTC Clock Source
  * @{
  */
#define RCC_RTCCLKSOURCE_NO_CLK          0x00000000U                     /*!< No clock */
#define RCC_RTCCLKSOURCE_LSE             RCC_BDCR_RTCSEL_LSE             /*!< LSE oscillator clock used as RTC clock */
#define RCC_RTCCLKSOURCE_LSI             RCC_BDCR_RTCSEL_LSI             /*!< LSI oscillator clock used as RTC clock */
#define RCC_RTCCLKSOURCE_HSE_DIV128      RCC_BDCR_RTCSEL_HSE             /*!< HSE oscillator clock divided by 128 used as RTC clock */
/**
  * @}
  */

/** @defgroup RCC_USBCLK_Source RCC USB Clock Source
  * @{
  */
#define RCC_USBCLKSOURCE_PLL_DIV1_5      0x00000000U                     /*!< PLL clock divided by 1.5 selected as USB clock source */
#define RCC_USBCLKSOURCE_PLL             RCC_CFGR_USBPRE                 /*!< PLL clock selected as USB clock source */
/**
  * @}
  */

/** @defgroup RCC_AHB_Peripherals_Clock_Enable_Disable RCC AHB Peripherals Clock Enable Disable
  * @{
  */
#define __HAL_RCC_DMA1_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->AHBENR, RCC_AHBENR_DMA1EN);\
                                        tmpreg = READ_BIT(RCC->AHBENR, RCC_AHBENR_DMA1EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_DMA1_CLK_DISABLE()  (RCC->AHBENR &= ~(RCC_AHBENR_DMA1EN))

#define __HAL_RCC_SRAM_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->AHBENR, RCC_AHBENR_SRAMEN);\
                                        tmpreg = READ_BIT(RCC->AHBENR, RCC_AHBENR_SRAMEN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_SRAM_CLK_DISABLE()  (RCC->AHBENR &= ~(RCC_AHBENR_SRAMEN))

#define __HAL_RCC_FLITF_CLK_ENABLE()  do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->AHBENR, RCC_AHBENR_FLITFEN);\
                                        tmpreg = READ_BIT(RCC->AHBENR, RCC_AHBENR_FLITFEN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_FLITF_CLK_DISABLE() (RCC->AHBENR &= ~(RCC_AHBENR_FLITFEN))

#define __HAL_RCC_CRC_CLK_ENABLE()    do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->AHBENR, RCC_AHBENR_CRCEN);\
                                        tmpreg = READ_BIT(RCC->AHBENR, RCC_AHBENR_CRCEN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_CRC_CLK_DISABLE()   (RCC->AHBENR &= ~(RCC_AHBENR_CRCEN))
/**
  * @}
  */

/** @defgroup RCC_APB1_Peripherals_Clock_Enable_Disable RCC APB1 Peripherals Clock Enable Disable
  * @{
  */
#define __HAL_RCC_TIM2_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM2EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM2EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_TIM2_CLK_DISABLE()  (RCC->APB1ENR &= ~(RCC_APB1ENR_TIM2EN))

#define __HAL_RCC_TIM3_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM3EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM3EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_TIM3_CLK_DISABLE()  (RCC->APB1ENR &= ~(RCC_APB1ENR_TIM3EN))

#define __HAL_RCC_TIM4_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM4EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM4EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_TIM4_CLK_DISABLE()  (RCC->APB1ENR &= ~(RCC_APB1ENR_TIM4EN))

#define __HAL_RCC_TIM5_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM5EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM5EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_TIM5_CLK_DISABLE()  (RCC->APB1ENR &= ~(RCC_APB1ENR_TIM5EN))

#define __HAL_RCC_TIM6_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM6EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM6EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_TIM6_CLK_DISABLE()  (RCC->APB1ENR &= ~(RCC_APB1ENR_TIM6EN))

#define __HAL_RCC_TIM7_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM7EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_TIM7EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_TIM7_CLK_DISABLE()  (RCC->APB1ENR &= ~(RCC_APB1ENR_TIM7EN))

#define __HAL_RCC_WWDG_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_WWDGEN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_WWDGEN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_WWDG_CLK_DISABLE()  (RCC->APB1ENR &= ~(RCC_APB1ENR_WWDGEN))

#define __HAL_RCC_SPI2_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_SPI2EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_SPI2EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_SPI2_CLK_DISABLE()  (RCC->APB1ENR &= ~(RCC_APB1ENR_SPI2EN))

#define __HAL_RCC_USART2_CLK_ENABLE() do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_USART2EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_USART2EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_USART2_CLK_DISABLE() (RCC->APB1ENR &= ~(RCC_APB1ENR_USART2EN))

#define __HAL_RCC_USART3_CLK_ENABLE() do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_USART3EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_USART3EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_USART3_CLK_DISABLE() (RCC->APB1ENR &= ~(RCC_APB1ENR_USART3EN))

#define __HAL_RCC_I2C1_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_I2C1EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_I2C1EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_I2C1_CLK_DISABLE()  (RCC->APB1ENR &= ~(RCC_APB1ENR_I2C1EN))

#define __HAL_RCC_I2C2_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_I2C2EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_I2C2EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_I2C2_CLK_DISABLE()  (RCC->APB1ENR &= ~(RCC_APB1ENR_I2C2EN))

#define __HAL_RCC_USB_CLK_ENABLE()    do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_USBEN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_USBEN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_USB_CLK_DISABLE()   (RCC->APB1ENR &= ~(RCC_APB1ENR_USBEN))

#define __HAL_RCC_CAN1_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_CAN1EN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_CAN1EN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_CAN1_CLK_DISABLE()  (RCC->APB1ENR &= ~(RCC_APB1ENR_CAN1EN))

#define __HAL_RCC_BKP_CLK_ENABLE()    do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_BKPEN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_BKPEN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_BKP_CLK_DISABLE()   (RCC->APB1ENR &= ~(RCC_APB1ENR_BKPEN))

#define __HAL_RCC_PWR_CLK_ENABLE()    do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB1ENR, RCC_APB1ENR_PWREN);\
                                        tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_PWREN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_PWR_CLK_DISABLE()   (RCC->APB1ENR &= ~(RCC_APB1ENR_PWREN))
/**
  * @}
  */

/** @defgroup RCC_APB2_Peripherals_Clock_Enable_Disable RCC APB2 Peripherals Clock Enable Disable
  * @{
  */
#define __HAL_RCC_AFIO_CLK_ENABLE()   do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB2ENR, RCC_APB2ENR_AFIOEN);\
                                        tmpreg = READ_BIT(RCC->APB2ENR, RCC_APB2ENR_AFIOEN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_AFIO_CLK_DISABLE()  (RCC->APB2ENR &= ~(RCC_APB2ENR_AFIOEN))

#define __HAL_RCC_GPIOA_CLK_ENABLE()  do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB2ENR, RCC_APB2ENR_IOPAEN);\
                                        tmpreg = READ_BIT(RCC->APB2ENR, RCC_APB2ENR_IOPAEN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_GPIOA_CLK_DISABLE() (RCC->APB2ENR &= ~(RCC_APB2ENR_IOPAEN))

#define __HAL_RCC_GPIOB_CLK_ENABLE()  do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB2ENR, RCC_APB2ENR_IOPBEN);\
                                        tmpreg = READ_BIT(RCC->APB2ENR, RCC_APB2ENR_IOPBEN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_GPIOB_CLK_DISABLE() (RCC->APB2ENR &= ~(RCC_APB2ENR_IOPBEN))

#define __HAL_RCC_GPIOC_CLK_ENABLE()  do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB2ENR, RCC_APB2ENR_IOPCEN);\
                                        tmpreg = READ_BIT(RCC->APB2ENR, RCC_APB2ENR_IOPCEN);\
                                        UNUSED(tmpreg); \
                                      } while(0U)
#define __HAL_RCC_GPIOC_CLK_DISABLE() (RCC->APB2ENR &= ~(RCC_APB2ENR_IOPCEN))

#define __HAL_RCC_GPIOD_CLK_ENABLE()  do { \
                                        __IO uint32_t tmpreg = 0x00U; \
                                        SET_BIT(RCC->APB2ENR, RCC_APB2ENR_IOPDEN);\
                                        tmpreg = READ_BIT(RCC->APB2ENR, RCC_APB2ENR_IOPDEN);\
                                        UNUSED(tmpreg);
