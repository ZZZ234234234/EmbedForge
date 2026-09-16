/**
  ******************************************************************************
  * @file    stm32f1xx_hal_gpio_ex.h
  * @author  MCD Application Team
  * @brief   Header file of GPIO HAL Extension module.
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
#ifndef __STM32F1xx_HAL_GPIO_EX_H
#define __STM32F1xx_HAL_GPIO_EX_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include "stm32f1xx_hal_def.h"

/** @addtogroup STM32F1xx_HAL_Driver
  * @{
  */

/** @defgroup GPIOEx GPIOEx
  * @{
  */

/* Exported types ------------------------------------------------------------*/
/* Exported constants --------------------------------------------------------*/

/** @defgroup GPIOEx_Exported_Constants GPIOEx Exported Constants
  * @{
  */

/** @defgroup GPIOEx_EVENTOUT EVENTOUT Cortex Configuration
  * @brief This section propose definition to use the Cortex EVENTOUT signal.
  * @{
  */

/** @defgroup GPIOEx_EVENTOUT_PIN EVENTOUT Pin
  * @{
  */

#define AFIO_EVENTOUT_PIN_0   AFIO_EVCR_PIN_PX0  /*!< EVENTOUT on pin 0 */
#define AFIO_EVENTOUT_PIN_1   AFIO_EVCR_PIN_PX1  /*!< EVENTOUT on pin 1 */
#define AFIO_EVENTOUT_PIN_2   AFIO_EVCR_PIN_PX2  /*!< EVENTOUT on pin 2 */
#define AFIO_EVENTOUT_PIN_3   AFIO_EVCR_PIN_PX3  /*!< EVENTOUT on pin 3 */
#define AFIO_EVENTOUT_PIN_4   AFIO_EVCR_PIN_PX4  /*!< EVENTOUT on pin 4 */
#define AFIO_EVENTOUT_PIN_5   AFIO_EVCR_PIN_PX5  /*!< EVENTOUT on pin 5 */
#define AFIO_EVENTOUT_PIN_6   AFIO_EVCR_PIN_PX6  /*!< EVENTOUT on pin 6 */
#define AFIO_EVENTOUT_PIN_7   AFIO_EVCR_PIN_PX7  /*!< EVENTOUT on pin 7 */
#define AFIO_EVENTOUT_PIN_8   AFIO_EVCR_PIN_PX8  /*!< EVENTOUT on pin 8 */
#define AFIO_EVENTOUT_PIN_9   AFIO_EVCR_PIN_PX9  /*!< EVENTOUT on pin 9 */
#define AFIO_EVENTOUT_PIN_10  AFIO_EVCR_PIN_PX10 /*!< EVENTOUT on pin 10 */
#define AFIO_EVENTOUT_PIN_11  AFIO_EVCR_PIN_PX11 /*!< EVENTOUT on pin 11 */
#define AFIO_EVENTOUT_PIN_12  AFIO_EVCR_PIN_PX12 /*!< EVENTOUT on pin 12 */
#define AFIO_EVENTOUT_PIN_13  AFIO_EVCR_PIN_PX13 /*!< EVENTOUT on pin 13 */
#define AFIO_EVENTOUT_PIN_14  AFIO_EVCR_PIN_PX14 /*!< EVENTOUT on pin 14 */
#define AFIO_EVENTOUT_PIN_15  AFIO_EVCR_PIN_PX15 /*!< EVENTOUT on pin 15 */

#define IS_AFIO_EVENTOUT_PIN(__PIN__) (((__PIN__) == AFIO_EVENTOUT_PIN_0)  || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_1)  || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_2)  || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_3)  || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_4)  || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_5)  || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_6)  || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_7)  || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_8)  || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_9)  || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_10) || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_11) || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_12) || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_13) || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_14) || \
                                       ((__PIN__) == AFIO_EVENTOUT_PIN_15))
/**
  * @}
  */

/** @defgroup GPIOEx_EVENTOUT_PORT EVENTOUT Port
  * @{
  */

#define AFIO_EVENTOUT_PORT_A  AFIO_EVCR_PORT_PA /*!< EVENTOUT on port A */
#define AFIO_EVENTOUT_PORT_B  AFIO_EVCR_PORT_PB /*!< EVENTOUT on port B */
#define AFIO_EVENTOUT_PORT_C  AFIO_EVCR_PORT_PC /*!< EVENTOUT on port C */
#define AFIO_EVENTOUT_PORT_D  AFIO_EVCR_PORT_PD /*!< EVENTOUT on port D */
#define AFIO_EVENTOUT_PORT_E  AFIO_EVCR_PORT_PE /*!< EVENTOUT on port E */

#define IS_AFIO_EVENTOUT_PORT(__PORT__) (((__PORT__) == AFIO_EVENTOUT_PORT_A) || \
                                         ((__PORT__) == AFIO_EVENTOUT_PORT_B) || \
                                         ((__PORT__) == AFIO_EVENTOUT_PORT_C) || \
                                         ((__PORT__) == AFIO_EVENTOUT_PORT_D) || \
                                         ((__PORT__) == AFIO_EVENTOUT_PORT_E))
/**
  * @}
  */

/**
  * @}
  */

/** @defgroup GPIOEx_AFIO_AF_REMAPPING AFIO Remap
  * @{
  */

/** @defgroup GPIOEx_AFIO_AF_REMAPPING_AF AFIO Remap Alternate Function
  * @{
  */

#define AFIO_REMAP_SPI1_ENABLE()        do{ SET_BIT(AFIO->MAPR, AFIO_MAPR_SPI1_REMAP); }while(0U)
#define AFIO_REMAP_SPI1_DISABLE()       do{ CLEAR_BIT(AFIO->MAPR, AFIO_MAPR_SPI1_REMAP); }while(0U)

#define AFIO_REMAP_I2C1_ENABLE()        do{ SET_BIT(AFIO->MAPR, AFIO_MAPR_I2C1_REMAP); }while(0U)
#define AFIO_REMAP_I2C1_DISABLE()       do{ CLEAR_BIT(AFIO->MAPR, AFIO_MAPR_I2C1_REMAP); }while(0U)

#define AFIO_REMAP_USART1_ENABLE()      do{ SET_BIT(AFIO->MAPR, AFIO_MAPR_USART1_REMAP); }while(0U)
#define AFIO_REMAP_USART1_DISABLE()     do{ CLEAR_BIT(AFIO->MAPR, AFIO_MAPR_USART1_REMAP); }while(0U)

#define AFIO_REMAP_USART2_ENABLE()      do{ SET_BIT(AFIO->MAPR, AFIO_MAPR_USART2_REMAP); }while(0U)
#define AFIO_REMAP_USART2_DISABLE()     do{ CLEAR_BIT(AFIO->MAPR, AFIO_MAPR_USART2_REMAP); }while(0U)

#define AFIO_REMAP_USART3_PARTIAL()     do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_USART3_REMAP, AFIO_MAPR_USART3_REMAP_PARTIALREMAP); }while(0U)
#define AFIO_REMAP_USART3_FULL()        do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_USART3_REMAP, AFIO_MAPR_USART3_REMAP_FULLREMAP); }while(0U)
#define AFIO_REMAP_USART3_DISABLE()     do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_USART3_REMAP, AFIO_MAPR_USART3_REMAP_NOREMAP); }while(0U)

#define AFIO_REMAP_TIM1_PARTIAL()       do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_TIM1_REMAP, AFIO_MAPR_TIM1_REMAP_PARTIALREMAP); }while(0U)
#define AFIO_REMAP_TIM1_FULL()          do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_TIM1_REMAP, AFIO_MAPR_TIM1_REMAP_FULLREMAP); }while(0U)
#define AFIO_REMAP_TIM1_DISABLE()       do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_TIM1_REMAP, AFIO_MAPR_TIM1_REMAP_NOREMAP); }while(0U)

#define AFIO_REMAP_TIM2_PARTIAL_1()     do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_TIM2_REMAP, AFIO_MAPR_TIM2_REMAP_PARTIALREMAP1); }while(0U)
#define AFIO_REMAP_TIM2_PARTIAL_2()     do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_TIM2_REMAP, AFIO_MAPR_TIM2_REMAP_PARTIALREMAP2); }while(0U)
#define AFIO_REMAP_TIM2_FULL()          do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_TIM2_REMAP, AFIO_MAPR_TIM2_REMAP_FULLREMAP); }while(0U)
#define AFIO_REMAP_TIM2_DISABLE()       do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_TIM2_REMAP, AFIO_MAPR_TIM2_REMAP_NOREMAP); }while(0U)

#define AFIO_REMAP_TIM3_PARTIAL()       do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_TIM3_REMAP, AFIO_MAPR_TIM3_REMAP_PARTIALREMAP); }while(0U)
#define AFIO_REMAP_TIM3_FULL()          do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_TIM3_REMAP, AFIO_MAPR_TIM3_REMAP_FULLREMAP); }while(0U)
#define AFIO_REMAP_TIM3_DISABLE()       do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_TIM3_REMAP, AFIO_MAPR_TIM3_REMAP_NOREMAP); }while(0U)

#define AFIO_REMAP_TIM4_ENABLE()        do{ SET_BIT(AFIO->MAPR, AFIO_MAPR_TIM4_REMAP); }while(0U)
#define AFIO_REMAP_TIM4_DISABLE()       do{ CLEAR_BIT(AFIO->MAPR, AFIO_MAPR_TIM4_REMAP); }while(0U)

#define AFIO_REMAP_CAN1_2()             do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_CAN_REMAP, AFIO_MAPR_CAN_REMAP_REMAP2); }while(0U)
#define AFIO_REMAP_CAN1_3()             do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_CAN_REMAP, AFIO_MAPR_CAN_REMAP_REMAP3); }while(0U)
#define AFIO_REMAP_CAN1_DISABLE()       do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_CAN_REMAP, AFIO_MAPR_CAN_REMAP_NOREMAP); }while(0U)

#define AFIO_REMAP_PD01_ENABLE()        do{ SET_BIT(AFIO->MAPR, AFIO_MAPR_PD01_REMAP); }while(0U)
#define AFIO_REMAP_PD01_DISABLE()       do{ CLEAR_BIT(AFIO->MAPR, AFIO_MAPR_PD01_REMAP); }while(0U)

#define AFIO_REMAP_TIM5CH4_ENABLE()     do{ SET_BIT(AFIO->MAPR, AFIO_MAPR_TIM5CH4_IREMAP); }while(0U)
#define AFIO_REMAP_TIM5CH4_DISABLE()    do{ CLEAR_BIT(AFIO->MAPR, AFIO_MAPR_TIM5CH4_IREMAP); }while(0U)

#define AFIO_REMAP_ADC1_ETRGINJ_ENABLE()  do{ SET_BIT(AFIO->MAPR, AFIO_MAPR_ADC1_ETRGINJ_REMAP); }while(0U)
#define AFIO_REMAP_ADC1_ETRGINJ_DISABLE() do{ CLEAR_BIT(AFIO->MAPR, AFIO_MAPR_ADC1_ETRGINJ_REMAP); }while(0U)

#define AFIO_REMAP_ADC1_ETRGREG_ENABLE()  do{ SET_BIT(AFIO->MAPR, AFIO_MAPR_ADC1_ETRGREG_REMAP); }while(0U)
#define AFIO_REMAP_ADC1_ETRGREG_DISABLE() do{ CLEAR_BIT(AFIO->MAPR, AFIO_MAPR_ADC1_ETRGREG_REMAP); }while(0U)

#define AFIO_REMAP_ADC2_ETRGINJ_ENABLE()  do{ SET_BIT(AFIO->MAPR, AFIO_MAPR_ADC2_ETRGINJ_REMAP); }while(0U)
#define AFIO_REMAP_ADC2_ETRGINJ_DISABLE() do{ CLEAR_BIT(AFIO->MAPR, AFIO_MAPR_ADC2_ETRGINJ_REMAP); }while(0U)

#define AFIO_REMAP_ADC2_ETRGREG_ENABLE()  do{ SET_BIT(AFIO->MAPR, AFIO_MAPR_ADC2_ETRGREG_REMAP); }while(0U)
#define AFIO_REMAP_ADC2_ETRGREG_DISABLE() do{ CLEAR_BIT(AFIO->MAPR, AFIO_MAPR_ADC2_ETRGREG_REMAP); }while(0U)

#define AFIO_REMAP_SWJ_ENABLE()         do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_SWJ_CFG, AFIO_MAPR_SWJ_CFG_RESET); }while(0U)
#define AFIO_REMAP_SWJ_NONJTRST()       do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_SWJ_CFG, AFIO_MAPR_SWJ_CFG_NOJNTRST); }while(0U)
#define AFIO_REMAP_SWJ_NOJTAG()         do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_SWJ_CFG, AFIO_MAPR_SWJ_CFG_JTAGDISABLE); }while(0U)
#define AFIO_REMAP_SWJ_DISABLE()        do{ MODIFY_REG(AFIO->MAPR, AFIO_MAPR_SWJ_CFG, AFIO_MAPR_SWJ_CFG_DISABLE); }while(0U)

/**
  * @}
  */

/**
  * @}
  */

/** @defgroup GPIOEx_IS_Alternat_function_selection IS_Alternate_function_selection
  * @{
  */

/**
  * @brief  AF 0 selection
  */
#define GPIO_AF0_RTC_50Hz      ((uint8_t)0x00)  /* RTC_50Hz Alternate Function mapping */
#define GPIO_AF0_MCO          ((uint8_t)0x00)  /* MCO (MCO1 and MCO2) Alternate Function mapping */
#define GPIO_AF0_SWJ          ((uint8_t)0x00)  /* SWJ (SWD and JTAG) Alternate Function mapping */
#define GPIO_AF0_TRACE        ((uint8_t)0x00)  /* TRACE Alternate Function mapping */

/**
  * @brief  AF 1 selection
  */
#define GPIO_AF1_TIM1         ((uint8_t)0x01)  /* TIM1 Alternate Function mapping */
#define GPIO_AF1_TIM2         ((uint8_t)0x01)  /* TIM2 Alternate Function mapping */

/**
  * @brief  AF 2 selection
  */
#define GPIO_AF2_TIM3         ((uint8_t)0x02)  /* TIM3 Alternate Function mapping */
#define GPIO_AF2_TIM4         ((uint8_t)0x02)  /* TIM4 Alternate Function mapping */
#define GPIO_AF2_TIM5         ((uint8_t)0x02)  /* TIM5 Alternate Function mapping */

/**
  * @brief  AF 3 selection
  */
#define GPIO_AF3_TIM8         ((uint8_t)0x03)  /* TIM8 Alternate Function mapping */
#define GPIO_AF3_TIM9         ((uint8_t)0x03)  /* TIM9 Alternate Function mapping */
#define GPIO_AF3_TIM10        ((uint8_t)0x03)  /* TIM10 Alternate Function mapping */
#define GPIO_AF3_TIM11        ((uint8_t)0x03)  /* TIM11 Alternate Function mapping */

/**
  * @brief  AF 4 selection
  */
#define GPIO_AF4_I2C1         ((uint8_t)0x04)  /* I2C1 Alternate Function mapping */
#define GPIO_AF4_I2C2         ((uint8_t)0x04)  /* I2C2 Alternate Function mapping */

/**
  * @brief  AF 5 selection
  */
#define GPIO_AF5_SPI1         ((uint8_t)0x05)  /* SPI1 Alternate Function mapping */
#define GPIO_AF5_SPI2         ((uint8_t)0x05)  /* SPI2 Alternate Function mapping */

/**
  * @brief  AF 6 selection
  */
#define GPIO_AF6_SPI3         ((uint8_t)0x06)  /* SPI3 Alternate Function mapping */

/**
  * @brief  AF 7 selection
  */
#define GPIO_AF7_USART1       ((uint8_t)0x07)  /* USART1 Alternate Function mapping */
#define GPIO_AF7_USART2       ((uint8_t)0x07)  /* USART2 Alternate Function mapping */
#define GPIO_AF7_USART3       ((uint8_t)0x07)  /* USART3 Alternate Function mapping */

/**
  * @brief  AF 8 selection
  */
#define GPIO_AF8_UART4        ((uint8_t)0x08)  /* UART4 Alternate Function mapping */
#define GPIO_AF8_UART5        ((uint8_t)0x08)  /* UART5 Alternate Function mapping */
#define GPIO_AF8_USART6       ((uint8_t)0x08)  /* USART6 Alternate Function mapping */

/**
  * @brief  AF 9 selection
  */
#define GPIO_AF9_CAN1         ((uint8_t)0x09)  /* CAN1 Alternate Function mapping */
#define GPIO_AF9_CAN2         ((uint8_t)0x09)  /* CAN2 Alternate Function mapping */
#define GPIO_AF9_TIM12        ((uint8_t)0x09)  /* TIM12 Alternate Function mapping */
#define GPIO_AF9_TIM13        ((uint8_t)0x09)  /* TIM13 Alternate Function mapping */
#define GPIO_AF9_TIM14        ((uint8_t)0x09)  /* TIM14 Alternate Function mapping */

/**
  * @brief  AF 10 selection
  */
#define GPIO_AF10_OTG_FS      ((uint8_t)0x0A)  /* OTG_FS Alternate Function mapping */
#define GPIO_AF10_OTG_HS      ((uint8_t)0x0A)  /* OTG_HS Alternate Function mapping */

/**
  * @brief  AF 11 selection
  */
#define GPIO_AF11_ETH         ((uint8_t)0x0B)  /* ETHERNET Alternate Function mapping */

/**
  * @brief  AF 12 selection
  */
#define GPIO_AF12_FSMC        ((uint8_t)0x0C)  /* FSMC Alternate Function mapping */
#define GPIO_AF12_OTG_HS_FS   ((uint8_t)0x0C)  /* OTG HS configured in FS, Alternate Function mapping */
#define GPIO_AF12_SDIO        ((uint8_t)0x0C)  /* SDIO Alternate Function mapping */

/**
  * @brief  AF 13 selection
  */
#define GPIO_AF13_DCMI        ((uint8_t)0x0D)  /* DCMI Alternate Function mapping */

/**
  * @brief  AF 14 selection
  */
#define GPIO_AF14_TIM15       ((uint8_t)0x0E)  /* TIM15 Alternate Function mapping */
#define GPIO_AF14_TIM16       ((uint8_t)0x0E)  /* TIM16 Alternate Function mapping */
#define GPIO_AF14_TIM17       ((uint8_t)0x0E)  /* TIM17 Alternate Function mapping */

/**
  * @brief  AF 15 selection
  */
#define GPIO_AF15_EVENTOUT    ((uint8_t)0x0F)  /* EVENTOUT Alternate Function mapping */

#define IS_GPIO_AF(AF)   (((AF) == GPIO_AF0_RTC_50Hz)   || ((AF) == GPIO_AF0_MCO)        || \
                          ((AF) == GPIO_AF0_SWJ)        || ((AF) == GPIO_AF0_TRACE)      || \
                          ((AF) == GPIO_AF1_TIM1)       || ((AF) == GPIO_AF1_TIM2)       || \
                          ((AF) == GPIO_AF2_TIM3)       || ((AF) == GPIO_AF2_TIM4)       || \
                          ((AF) == GPIO_AF2_TIM5)       || ((AF) == GPIO_AF3_TIM8)       || \
                          ((AF) == GPIO_AF3_TIM9)       || ((AF) == GPIO_AF3_TIM10)      || \
                          ((AF) == GPIO_AF3_TIM11)      || ((AF) == GPIO_AF4_I2C1)       || \
                          ((AF) == GPIO_AF4_I2C2)       || ((AF) == GPIO_AF5_SPI1)       || \
                          ((AF) == GPIO_AF5_SPI2)       || ((AF) == GPIO_AF6_SPI3)       || \
                          ((AF) == GPIO_AF7_USART1)     || ((AF) == GPIO_AF7_USART2)     || \
                          ((AF) == GPIO_AF7_USART3)     || ((AF) == GPIO_AF8_UART4)      || \
                          ((AF) == GPIO_AF8_UART5)      || ((AF) == GPIO_AF8_USART6)     || \
                          ((AF) == GPIO_AF9_CAN1)       || ((AF) == GPIO_AF9_CAN2)       || \
                          ((AF) == GPIO_AF9_TIM12)      || ((AF) == GPIO_AF9_TIM13)      || \
                          ((AF) == GPIO_AF9_TIM14)      || ((AF) == GPIO_AF10_OTG_FS)    || \
                          ((AF) == GPIO_AF10_OTG_HS)    || ((AF) == GPIO_AF11_ETH)       || \
                          ((AF) == GPIO_AF12_FSMC)      || ((AF) == GPIO_AF12_OTG_HS_FS) || \
                          ((AF) == GPIO_AF12_SDIO)      || ((AF) == GPIO_AF13_DCMI)      || \
                          ((AF) == GPIO_AF14_TIM15)     || ((AF) == GPIO_AF14_TIM16)     || \
                          ((AF) == GPIO_AF14_TIM17)     || ((AF) == GPIO_AF15_EVENTOUT))

/**
  * @}
  */

/* Exported macro ------------------------------------------------------------*/
/** @defgroup GPIOEx_Exported_Macros GPIOEx Exported Macros
  * @{
  */

/** @defgroup GPIOEx_Get_Port_Index GPIOEx Get Port Index
  * @{
  */
#if defined(STM32F100xB) || defined(STM32F100xE) || defined(STM32F101x6) || defined(STM32F101xB) || \
    defined(STM32F101xE) || defined(STM32F101xG) || defined(STM32F102x6) || defined(STM32F102xB) || \
    defined(STM32F103x6) || defined(STM32F103xB) || defined(STM32F103xE) || defined(STM32F103xG) || \
    defined(STM32F105xC) || defined(STM32F107xC)
#define GPIO_GET_INDEX(__GPIOx__) (((__GPIOx__) == (GPIOA))? 0uL :\
                                   ((__GPIOx__) == (GPIOB))? 1uL :\
                                   ((__GPIOx__) == (GPIOC))? 2uL :\
                                   ((__GPIOx__) == (GPIOD))? 3uL :\
                                   ((__GPIOx__) == (GPIOE))? 4uL :\
                                   ((__GPIOx__) == (GPIOF))? 5uL :\
                                   ((__GPIOx__) == (GPIOG))? 6uL : 7uL)
#endif

#if defined(STM32F100xB) || defined(STM32F100xE) || defined(STM32F101x6) || defined(STM32F101xB) || \
    defined(STM32F101xE) || defined(STM32F101xG) || defined(STM32F102x6) || defined(STM32F102xB) || \
    defined(STM32F103x6) || defined(STM32F103xB) || defined(STM32F103xE) || defined(STM32F103xG)
#define GPIO_GET_INDEX(__GPIOx__) (((__GPIOx__) == (GPIOA))? 0uL :\
                                   ((__GPIOx__) == (GPIOB))? 1uL :\
                                   ((__GPIOx__) == (GPIOC))? 2uL :\
                                   ((__GPIOx__) == (GPIOD))? 3uL :\
                                   ((__GPIOx__) == (GPIOE))? 4uL : 5uL)
#endif

#if defined(STM32F105xC) || defined(STM32F107xC)
#define GPIO_GET_INDEX(__GPIOx__) (((__GPIOx__) == (GPIOA))? 0uL :\
                                   ((__GPIOx__) == (GPIOB))? 1uL :\
                                   ((__GPIOx__) == (GPIOC))? 2uL :\
                                   ((__GPIOx__) == (GPIOD))? 3uL :\
                                   ((__GPIOx__) == (GPIOE))? 4uL : 5uL)
#endif

/**
  * @}
  */

/**
  * @}
  */

/* Exported functions --------------------------------------------------------*/
/** @addtogroup GPIOEx_Exported_Functions
  * @{
  */

/** @addtogroup GPIOEx_Exported_Functions_Group1
  * @{
  */
void HAL_GPIOEx_ConfigEventout(uint32_t GPIO_PortSource, uint32_t GPIO_PinSource);
void HAL_GPIOEx_EnableEventout(void);
void HAL_GPIOEx_DisableEventout(void);

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

#endif /* __STM32F1xx_HAL_GPIO_EX_H */
