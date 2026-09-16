/**
  ******************************************************************************
  * @file    stm32f1xx_hal_rcc_ex.h
  * @author  MCD Application Team
  * @brief   Header file of RCC HAL Extension module.
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
#ifndef __STM32F1xx_HAL_RCC_EX_H
#define __STM32F1xx_HAL_RCC_EX_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include "stm32f1xx_hal_def.h"

/** @addtogroup STM32F1xx_HAL_Driver
  * @{
  */

/** @addtogroup RCCEx
  * @{
  */

/* Exported types ------------------------------------------------------------*/

/** @defgroup RCCEx_Exported_Types RCCEx Exported Types
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
  * @brief  RCC Internal/External Oscillator (HSE, HSI, LSE and LSI) configuration structure definition
  */
typedef struct
{
  uint32_t OscillatorType;       /*!< The oscillators to be configured.
                                      This parameter can be a value of @ref RCC_Oscillator_Type                   */

  uint32_t HSEState;             /*!< The new state of the HSE.
                                      This parameter can be a value of @ref RCC_HSE_Config                        */

  uint32_t HSEPredivValue;       /*!< The HSE predivision factor.
                                      This parameter can be a value of @ref RCCEx_Prediv1_Factor                  */

  uint32_t LSEState;             /*!< The new state of the LSE.
                                      This parameter can be a value of @ref RCC_LSE_Config                        */

  uint32_t HSIState;             /*!< The new state of the HSI.
                                      This parameter can be a value of @ref RCC_HSI_Config                        */

  uint32_t HSICalibrationValue;  /*!< The HSI calibration trimming value (default is RCC_HSICALIBRATION_DEFAULT).
                                      This parameter must be a number between Min_Data = 0x00 and Max_Data = 0x1F */

  uint32_t LSIState;             /*!< The new state of the LSI.
                                      This parameter can be a value of @ref RCC_LSI_Config                        */

  RCC_PLLInitTypeDef PLL;        /*!< PLL structure parameters                                                  */
} RCC_OscInitTypeDef;

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

/** @defgroup RCCEx_Exported_Constants RCCEx Exported Constants
  * @{
  */

/** @defgroup RCCEx_PLL_Multiplication_Factor RCCEx PLL Multiplication Factor
  * @{
  */
#define RCC_PLL_MUL2                    RCC_CFGR_PLLMULL2
#define RCC_PLL_MUL3                    RCC_CFGR_PLLMULL3
#define RCC_PLL_MUL4                    RCC_CFGR_PLLMULL4
#define RCC_PLL_MUL5                    RCC_CFGR_PLLMULL5
#define RCC_PLL_MUL6                    RCC_CFGR_PLLMULL6
#define RCC_PLL_MUL7                    RCC_CFGR_PLLMULL7
#define RCC_PLL_MUL8                    RCC_CFGR_PLLMULL8
#define RCC_PLL_MUL9                    RCC_CFGR_PLLMULL9
#define RCC_PLL_MUL10                   RCC_CFGR_PLLMULL10
#define RCC_PLL_MUL11                   RCC_CFGR_PLLMULL11
#define RCC_PLL_MUL12                   RCC_CFGR_PLLMULL12
#define RCC_PLL_MUL13                   RCC_CFGR_PLLMULL13
#define RCC_PLL_MUL14                   RCC_CFGR_PLLMULL14
#define RCC_PLL_MUL15                   RCC_CFGR_PLLMULL15
#define RCC_PLL_MUL16                   RCC_CFGR_PLLMULL16
/**
  * @}
  */

/** @defgroup RCCEx_Prediv1_Factor RCCEx Prediv1 Factor
  * @{
  */
#define RCC_HSE_PREDIV_DIV1             RCC_CFGR_PLLXTPRE
#define RCC_HSE_PREDIV_DIV2             (uint32_t)0x00000000U
/**
  * @}
  */

/** @defgroup RCCEx_USB_Clock_Source RCCEx USB Clock Source
  * @{
  */
#define RCC_USBCLKSOURCE_PLL_DIV1_5     (uint32_t)0x00000000U
#define RCC_USBCLKSOURCE_PLL            RCC_CFGR_USBPRE
/**
  * @}
  */

/** @defgroup RCCEx_MCO_Clock_Source RCCEx MCO Clock Source
  * @{
  */
#define RCC_MCO1SOURCE_NOCLOCK          (uint32_t)0x00000000U
#define RCC_MCO1SOURCE_SYSCLK           RCC_CFGR_MCO_SYSCLK
#define RCC_MCO1SOURCE_HSI              RCC_CFGR_MCO_HSI
#define RCC_MCO1SOURCE_HSE              RCC_CFGR_MCO_HSE
#define RCC_MCO1SOURCE_PLLCLK           RCC_CFGR_MCO_PLL
/**
  * @}
  */

/** @defgroup RCCEx_MCO_Prescaler RCCEx MCO Prescaler
  * @{
  */
#define RCC_MCODIV_1                    (uint32_t)0x00000000U
#define RCC_MCODIV_2                    RCC_CFGR_MCO_PRE_2
#define RCC_MCODIV_4                    RCC_CFGR_MCO_PRE_4
#define RCC_MCODIV_8                    RCC_CFGR_MCO_PRE_8
#define RCC_MCODIV_16                   RCC_CFGR_MCO_PRE_16
/**
  * @}
  */

/** @defgroup RCCEx_Flags_Interrupts_Management RCCEx Flags Interrupts Management
  * @{
  */
#define RCC_FLAG_MCOF                   ((uint8_t)0x9C)
/**
  * @}
  */

/**
  * @}
  */

/* Exported macro ------------------------------------------------------------*/

/** @defgroup RCCEx_Exported_Macros RCCEx Exported Macros
  * @{
  */

/** @defgroup RCCEx_Peripheral_Clock_Enable_Disable RCCEx Peripheral Clock Enable Disable
  * @brief  Enable or disable the AHB1 peripheral clock.
  * @note   After reset, the peripheral clock (used for registers read/write access)
  *         is disabled and the application software has to enable this clock before
  *         using it.
  * @{
  */

/**
  * @brief  Enable the USB OTG FS clock.
  * @retval None
  */
#define __HAL_RCC_USB_OTG_FS_CLK_ENABLE()  do { \
                                                 __IO uint32_t tmpreg = 0U; \
                                                 SET_BIT(RCC->APB1ENR, RCC_APB1ENR_USBEN); \
                                                 tmpreg = READ_BIT(RCC->APB1ENR, RCC_APB1ENR_USBEN); \
                                                 UNUSED(tmpreg); \
                                               } while(0U)

/**
  * @brief  Disable the USB OTG FS clock.
  * @retval None
  */
#define __HAL_RCC_USB_OTG_FS_CLK_DISABLE() (RCC->APB1ENR &= ~(RCC_APB1ENR_USBEN))

/**
  * @brief  Enable the USB OTG FS clock.
  * @retval None
  */
#define __HAL_RCC_USB_CLK_ENABLE()   __HAL_RCC_USB_OTG_FS_CLK_ENABLE()

/**
  * @brief  Disable the USB OTG FS clock.
  * @retval None
  */
#define __HAL_RCC_USB_CLK_DISABLE()  __HAL_RCC_USB_OTG_FS_CLK_DISABLE()

/**
  * @}
  */

/** @defgroup RCCEx_Force_Release_Peripheral_Reset RCCEx Force Release Peripheral Reset
  * @brief  Force or release AHB peripheral reset.
  * @{
  */

/**
  * @brief  Force the USB OTG FS reset.
  * @retval None
  */
#define __HAL_RCC_USB_OTG_FS_FORCE_RESET()   (RCC->APB1RSTR |= (RCC_APB1RSTR_USBRST))

/**
  * @brief  Release the USB OTG FS reset.
  * @retval None
  */
#define __HAL_RCC_USB_OTG_FS_RELEASE_RESET() (RCC->APB1RSTR &= ~(RCC_APB1RSTR_USBRST))

/**
  * @brief  Force the USB reset.
  * @retval None
  */
#define __HAL_RCC_USB_FORCE_RESET()   __HAL_RCC_USB_OTG_FS_FORCE_RESET()

/**
  * @brief  Release the USB reset.
  * @retval None
  */
#define __HAL_RCC_USB_RELEASE_RESET() __HAL_RCC_USB_OTG_FS_RELEASE_RESET()

/**
  * @}
  */

/** @defgroup RCCEx_Peripheral_Clock_Sleep_Enable_Disable RCCEx Peripheral Clock Sleep Enable Disable
  * @brief  Enable or disable the AHB1 peripheral clock during Low Power (Sleep) mode.
  * @note   Peripheral clock gating in SLEEP mode can be used to further reduce
  *         power consumption.
  * @note   After wakeup from SLEEP mode, the peripheral clock is enabled again.
  * @note   By default, all peripheral clocks are enabled during SLEEP mode.
  * @{
  */

/**
  * @brief  Enable the USB OTG FS clock during Sleep Mode.
  * @retval None
  */
#define __HAL_RCC_USB_OTG_FS_CLK_SLEEP_ENABLE()  (RCC->APB1LPENR |= (RCC_APB1LPENR_USBLPEN))

/**
  * @brief  Disable the USB OTG FS clock during Sleep Mode.
  * @retval None
  */
#define __HAL_RCC_USB_OTG_FS_CLK_SLEEP_DISABLE() (RCC->APB1LPENR &= ~(RCC_APB1LPENR_USBLPEN))

/**
  * @brief  Enable the USB clock during Sleep Mode.
  * @retval None
  */
#define __HAL_RCC_USB_CLK_SLEEP_ENABLE()   __HAL_RCC_USB_OTG_FS_CLK_SLEEP_ENABLE()

/**
  * @brief  Disable the USB clock during Sleep Mode.
  * @retval None
  */
#define __HAL_RCC_USB_CLK_SLEEP_DISABLE()  __HAL_RCC_USB_OTG_FS_CLK_SLEEP_DISABLE()

/**
  * @}
  */

/** @defgroup RCCEx_Flags_Interrupts_Management RCCEx Flags Interrupts Management
  * @{
  */

/**
  * @brief  Clear the MCO interrupt pending bit.
  * @retval None
  */
#define __HAL_RCC_CLEAR_IT(IT)  do { \
                                    __IO uint32_t tmpreg = 0U; \
                                    tmpreg = READ_BIT(RCC->CIR, (IT)); \
                                    UNUSED(tmpreg); \
                                  } while(0U)

/**
  * @brief  Check whether the RCC interrupt has occurred or not.
  * @param  __INTERRUPT__ specifies the RCC interrupt source to check.
  *         This parameter can be one of the following values:
  *            @arg @ref RCC_IT_LSIRDY
  *            @arg @ref RCC_IT_LSERDY
  *            @arg @ref RCC_IT_HSIRDY
  *            @arg @ref RCC_IT_HSERDY
  *            @arg @ref RCC_IT_PLLRDY
  *            @arg @ref RCC_IT_CSS
  *            @arg @ref RCC_IT_MCO
  * @retval The new state of __INTERRUPT__ (TRUE or FALSE).
  */
#define __HAL_RCC_GET_IT(__INTERRUPT__)  ((RCC->CIR & (__INTERRUPT__)) == (__INTERRUPT__))

/**
  * @brief  Clear the RCC's interrupt pending bits.
  * @param  __INTERRUPT__ specifies the interrupt pending bit to clear.
  *         This parameter can be one of the following values:
  *            @arg @ref RCC_IT_LSIRDY
  *            @arg @ref RCC_IT_LSERDY
  *            @arg @ref RCC_IT_HSIRDY
  *            @arg @ref RCC_IT_HSERDY
  *            @arg @ref RCC_IT_PLLRDY
  *            @arg @ref RCC_IT_CSS
  *            @arg @ref RCC_IT_MCO
  * @retval None
  */
#define __HAL_RCC_CLEAR_IT(__INTERRUPT__)  (RCC->CIR = (__INTERRUPT__))

/**
  * @brief  Check whether the RCC flag is set or not.
  * @param  __FLAG__ specifies the flag to check.
  *         This parameter can be one of the following values:
  *            @arg @ref RCC_FLAG_HSIRDY
  *            @arg @ref RCC_FLAG_HSERDY
  *            @arg @ref RCC_FLAG_PLLRDY
  *            @arg @ref RCC_FLAG_LSERDY
  *            @arg @ref RCC_FLAG_LSIRDY
  *            @arg @ref RCC_FLAG_PINRST
  *            @arg @ref RCC_FLAG_PORRST
  *            @arg @ref RCC_FLAG_SFTRST
  *            @arg @ref RCC_FLAG_IWDGRST
  *            @arg @ref RCC_FLAG_WWDGRST
  *            @arg @ref RCC_FLAG_LPWRRST
  *            @arg @ref RCC_FLAG_MCOF
  * @retval The new state of __FLAG__ (TRUE or FALSE).
  */
#define __HAL_RCC_GET_FLAG(__FLAG__)  (((((__FLAG__) >> 5U) == 1U) ? RCC->CR : \
                                        ((((__FLAG__) >> 5U) == 2U) ? RCC->BDCR : \
                                         ((((__FLAG__) >> 5U) == 3U) ? RCC->CSR : RCC->CIR))) & \
                                       (1UL << ((__FLAG__) & 0x1FU)))

/**
  * @}
  */

/**
  * @}
  */

/* Exported functions --------------------------------------------------------*/

/** @addtogroup RCCEx_Exported_Functions
  * @{
  */

/** @addtogroup RCCEx_Exported_Functions_Group1
  * @{
  */

HAL_StatusTypeDef HAL_RCCEx_PeriphCLKConfig(RCC_PeriphCLKInitTypeDef  *PeriphClkInit);
void              HAL_RCCEx_GetPeriphCLKConfig(RCC_PeriphCLKInitTypeDef  *PeriphClkInit);
uint32_t          HAL_RCCEx_GetPeriphCLKFreq(uint32_t PeriphClk);

/**
  * @}
  */

/**
  * @}
  */

/**
  * @}
  */

/**
  * @}
  */

#ifdef __cplusplus
}
#endif

#endif /* __STM32F1xx_HAL_RCC_EX_H */
