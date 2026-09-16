```c
/**
  ******************************************************************************
  * @file    stm32f103xb.h
  * @brief   CMSIS STM32F103xB Device Peripheral Access Layer Header File.
  *
  *          This file contains:
  *           - Data structures and the address mapping for all peripherals
  *           - Peripheral's registers declarations and bits definition
  *           - Macros to access peripheral's registers hardware
  *
  ******************************************************************************
  * @attention
  *
  * Copyright (c) 2024 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  ******************************************************************************
  */

/** @addtogroup CMSIS_Device
  * @{
  */

/** @addtogroup stm32f103xb
  * @{
  */

#ifndef __STM32F103xB_H
#define __STM32F103xB_H

#ifdef __cplusplus
 extern "C" {
#endif

/** @addtogroup Configuration_section_for_CMSIS
  * @{
  */

/**
 * @brief Configuration of the Cortex-M3 Processor and Core Peripherals
 */
#define __CM3_REV                 0x0200U  /*!< Core Revision r2p0                           */
#define __MPU_PRESENT             0U       /*!< STM32F103xB does not provide an MPU          */
#define __NVIC_PRIO_BITS          4U       /*!< STM32F103xB uses 4 Bits for the Priority Levels */
#define __Vendor_SysTickConfig    0U       /*!< Set to 1 if different SysTick Config is used */

/**
 * @brief STM32F103xB Interrupt Number Definition
 */
typedef enum
{
/******  Cortex-M3 Processor Exceptions Numbers ***************************************************/
  NonMaskableInt_IRQn         = -14,    /*!< 2 Non Maskable Interrupt                             */
  HardFault_IRQn              = -13,    /*!< 3 Cortex-M3 Hard Fault Interrupt                     */
  MemoryManagement_IRQn       = -12,    /*!< 4 Cortex-M3 Memory Management Interrupt              */
  BusFault_IRQn               = -11,    /*!< 5 Cortex-M3 Bus Fault Interrupt                      */
  UsageFault_IRQn             = -10,    /*!< 6 Cortex-M3 Usage Fault Interrupt                    */
  SVCall_IRQn                 = -5,     /*!< 11 Cortex-M3 SV Call Interrupt                       */
  DebugMonitor_IRQn           = -4,     /*!< 12 Cortex-M3 Debug Monitor Interrupt                 */
  PendSV_IRQn                 = -2,     /*!< 14 Cortex-M3 Pend SV Interrupt                       */
  SysTick_IRQn                = -1,     /*!< 15 Cortex-M3 System Tick Interrupt                   */

/******  STM32 specific Interrupt Numbers *********************************************************/
  WWDG_IRQn                   = 0,      /*!< Window WatchDog Interrupt                            */
  PVD_IRQn                    = 1,      /*!< PVD through EXTI Line detection Interrupt            */
  TAMPER_IRQn                 = 2,      /*!< Tamper Interrupt                                     */
  RTC_IRQn                    = 3,      /*!< RTC global Interrupt                                 */
  FLASH_IRQn                  = 4,      /*!< FLASH global Interrupt                               */
  RCC_IRQn                    = 5,      /*!< RCC global Interrupt                                 */
  EXTI0_IRQn                  = 6,      /*!< EXTI Line0 Interrupt                                 */
  EXTI1_IRQn                  = 7,      /*!< EXTI Line1 Interrupt                                 */
  EXTI2_IRQn                  = 8,      /*!< EXTI Line2 Interrupt                                 */
  EXTI3_IRQn                  = 9,      /*!< EXTI Line3 Interrupt                                 */
  EXTI4_IRQn                  = 10,     /*!< EXTI Line4 Interrupt                                 */
  DMA1_Channel1_IRQn          = 11,     /*!< DMA1 Channel 1 global Interrupt                      */
  DMA1_Channel2_IRQn          = 12,     /*!< DMA1 Channel 2 global Interrupt                      */
  DMA1_Channel3_IRQn          = 13,     /*!< DMA1 Channel 3 global Interrupt                      */
  DMA1_Channel4_IRQn          = 14,     /*!< DMA1 Channel 4 global Interrupt                      */
  DMA1_Channel5_IRQn          = 15,     /*!< DMA1 Channel 5 global Interrupt                      */
  DMA1_Channel6_IRQn          = 16,     /*!< DMA1 Channel 6 global Interrupt                      */
  DMA1_Channel7_IRQn          = 17,     /*!< DMA1 Channel 7 global Interrupt                      */
  ADC1_2_IRQn                 = 18,     /*!< ADC1 and ADC2 global Interrupt                       */
  USB_HP_CAN1_TX_IRQn         = 19,     /*!< USB Device High Priority or CAN1 TX Interrupts       */
  USB_LP_CAN1_RX0_IRQn        = 20,     /*!< USB Device Low Priority or CAN1 RX0 Interrupts       */
  CAN1_RX1_IRQn               = 21,     /*!< CAN1 RX1 Interrupt                                   */
  CAN1_SCE_IRQn               = 22,     /*!< CAN1 SCE Interrupt                                   */
  EXTI9_5_IRQn                = 23,     /*!< External Line[9:5] Interrupts                        */
  TIM1_BRK_IRQn               = 24,     /*!< TIM1 Break Interrupt                                 */
  TIM1_UP_IRQn                = 25,     /*!< TIM1 Update Interrupt                                */
  TIM1_TRG_COM_IRQn           = 26,     /*!< TIM1 Trigger and Commutation Interrupt               */
  TIM1_CC_IRQn                = 27,     /*!< TIM1 Capture Compare Interrupt                       */
  TIM2_IRQn                   = 28,     /*!< TIM2 global Interrupt                                */
  TIM3_IRQn                   = 29,     /*!< TIM3 global Interrupt                                */
  TIM4_IRQn                   = 30,     /*!< TIM4 global Interrupt                                */
  I2C1_EV_IRQn                = 31,     /*!< I2C1 Event Interrupt                                 */
  I2C1_ER_IRQn                = 32,     /*!< I2C1 Error Interrupt                                 */
  I2C2_EV_IRQn                = 33,     /*!< I2C2 Event Interrupt                                 */
  I2C2_ER_IRQn                = 34,     /*!< I2C2 Error Interrupt                                 */
  SPI1_IRQn                   = 35,     /*!< SPI1 global Interrupt                                */
  SPI2_IRQn                   = 36,     /*!< SPI2 global Interrupt                                */
  USART1_IRQn                 = 37,     /*!< USART1 global Interrupt                              */
  USART2_IRQn                 = 38,     /*!< USART2 global Interrupt                              */
  USART3_IRQn                 = 39,     /*!< USART3 global Interrupt                              */
  EXTI15_10_IRQn              = 40,     /*!< External Line[15:10] Interrupts                      */
  RTCAlarm_IRQn               = 41,     /*!< RTC Alarm through EXTI Line Interrupt                */
  USBWakeUp_IRQn              = 42,     /*!< USB Device WakeUp from suspend through EXTI Line Interrupt */
} IRQn_Type;

/**
  * @}
  */

#include "core_cm3.h"
#include "system_stm32f1xx.h"
#include <stdint.h>

/** @addtogroup Peripheral_registers_structures
  * @{
  */

/**
  * @brief Analog to Digital Converter
  */
typedef struct
{
  __IO uint32_t SR;
  __IO uint32_t CR1;
  __IO uint32_t CR2;
  __IO uint32_t SMPR1;
  __IO uint32_t SMPR2;
  __IO uint32_t JOFR1;
  __IO uint32_t JOFR2;
  __IO uint32_t JOFR3;
  __IO uint32_t JOFR4;
  __IO uint32_t HTR;
  __IO uint32_t LTR;
  __IO uint32_t SQR1;
  __IO uint32_t SQR2;
  __IO uint32_t SQR3;
  __IO uint32_t JSQR;
  __IO uint32_t JDR1;
  __IO uint32_t JDR2;
  __IO uint32_t JDR3;
  __IO uint32_t JDR4;
  __IO uint32_t DR;
} ADC_TypeDef;

/**
  * @brief Backup Registers
  */
typedef struct
{
  uint32_t  RESERVED0;
  __IO uint32_t DR1;
  __IO uint32_t DR2;
  __IO uint32_t DR3;
  __IO uint32_t DR4;
  __IO uint32_t DR5;
  __IO uint32_t DR6;
  __IO uint32_t DR7;
  __IO uint32_t DR8;
  __IO uint32_t DR9;
  __IO uint32_t DR10;
  __IO uint32_t RTCCR;
  __IO uint32_t CR;
  __IO uint32_t CSR;
} BKP_TypeDef;

/**
  * @brief Controller Area Network
  */
typedef struct
{
  __IO uint32_t TIR;
  __IO uint32_t TDTR;
  __IO uint32_t TDLR;
  __IO uint32_t TDHR;
} CAN_TxMailBox_TypeDef;

typedef struct
{
  __IO uint32_t RIR;
  __IO uint32_t RDTR;
  __IO uint32_t RDLR;
  __IO uint32_t RDHR;
} CAN_FIFOMailBox_TypeDef;

typedef struct
{
  __IO uint32_t FR1;
  __IO uint32_t FR2;
} CAN_FilterRegister_TypeDef;

typedef struct
{
  __IO uint32_t MCR;
  __IO uint32_t MSR;
  __IO uint32_t TSR;
  __IO uint32_t RF0R;
  __IO uint32_t RF1R;
  __IO uint32_t IER;
  __IO uint32_t ESR;
  __IO uint32_t BTR;
  uint32_t  RESERVED0[88];
  CAN_TxMailBox_TypeDef      sTxMailBox[3];
  CAN_FIFOMailBox_TypeDef    sFIFOMailBox[2];
  uint32_t  RESERVED1[12];
  __IO uint32_t FMR;
  __IO uint32_t FM1R;
  uint32_t  RESERVED2;
  __IO uint32_t FS1R;
  uint32_t  RESERVED3;
  __IO uint32_t FFA1R;
  uint32_t  RESERVED4;
  __IO uint32_t FA1R;
  uint32_t  RESERVED5[8];
  CAN_FilterRegister_TypeDef sFilterRegister[14];
} CAN_TypeDef;

/**
  * @brief CRC calculation unit
  */
typedef struct
{
  __IO uint32_t DR;
  __IO uint8_t  IDR;
  uint8_t   RESERVED0;
  uint16_t  RESERVED1;
  __IO uint32_t CR;
} CRC_TypeDef;

/**
  * @brief Debug MCU
  */
typedef struct
{
  __IO uint32_t IDCODE;
  __IO uint32_t CR;
} DBGMCU_TypeDef;

/**
  * @brief DMA Controller
  */
typedef struct
{
  __IO uint32_t CCR;
  __IO uint32_t CNDTR;
  __IO uint32_t CPAR;
  __IO uint32_t CMAR;
} DMA_Channel_TypeDef;

typedef struct
{
  __IO uint32_t ISR;
  __IO uint32_t IFCR;
} DMA_TypeDef;

/**
  * @brief External Interrupt/Event Controller
  */
typedef struct
{
  __IO uint32_t IMR;
  __IO uint32_t EMR;
  __IO uint32_t RTSR;
  __IO uint32_t FTSR;
  __IO uint32_t SWIER;
  __IO uint32_t PR;
} EXTI_TypeDef;

/**
  * @brief FLASH Registers
  */
typedef struct
{
  __IO uint32_t ACR;
  __IO uint32_t KEYR;
  __IO uint32_t OPTKEYR;
  __IO uint32_t SR;
  __IO uint32_t CR;
  __IO uint32_t AR;
  __IO uint32_t RESERVED;
  __IO uint32_t OBR;
  __IO uint32_t WRPR;
} FLASH_TypeDef;

/**
  * @brief Option Bytes Registers
  */
typedef struct
{
  __IO uint16_t RDP;
  __IO uint16_t USER;
  __IO uint16_t Data0;
  __IO uint16_t Data1;
  __IO uint16_t WRP0;
  __IO uint16_t WRP1;
  __IO uint16_t WRP2;
  __IO uint16_t WRP3;
} OB_TypeDef;

/**
  * @brief General Purpose I/O
  */
typedef struct
{
  __IO uint32_t CRL;
  __IO uint32_t CRH;
  __IO uint32_t IDR;
  __IO uint32_t ODR;
  __IO uint32_t BSRR;
  __IO uint32_t BRR;
  __IO uint32_t LCKR;
} GPIO_TypeDef;

/**
  * @brief Alternate Function I/O
  */
typedef struct
{
  __IO uint32_t EVCR;
  __IO uint32_t MAPR;
  __IO uint32_t EXTICR[4];
  uint32_t RESERVED0;
  __IO uint32_t MAPR2;
} AFIO_TypeDef;

/**
  * @brief Inter-integrated Circuit Interface
  */
typedef struct
{
  __IO uint16_t CR1;
  uint16_t  RESERVED0;
  __IO uint16_t CR2;
  uint16_t  RESERVED1;
  __IO uint16_t OAR1;
  uint16_t  RESERVED2;
  __IO uint16_t OAR2;
  uint16_t  RESERVED3;
  __IO uint16_t DR;
  uint16_t  RESERVED4;
  __IO uint16_t SR1;
  uint16_t  RESERVED5;
  __IO uint16_t SR2;
  uint16_t  RESERVED6;
  __IO uint16_t CCR;
  uint16_t  RESERVED7;
  __IO uint16_t TRISE;
  uint16_t  RESERVED8;
} I2C_TypeDef;

/**
  * @brief Independent WATCHDOG
  */
typedef struct
{
  __IO uint32_t KR;
  __IO uint32_t PR;
  __IO uint32_t RLR;
  __IO uint32_t SR;
} IWDG_TypeDef;

/**
  * @brief Power Control
  */
typedef struct
{
  __IO uint32_t CR;
  __IO uint32_t CSR;
} PWR_TypeDef;

/**
  * @brief Reset and Clock Control
  */
typedef struct
{
  __IO uint32_t CR;
  __IO uint32_t CFGR;
  __IO uint32_t CIR;
  __IO uint32_t APB2RSTR;
  __IO uint32_t APB1RSTR;
  __IO uint32_t AHBENR;
  __IO uint32_t APB2ENR;
  __IO uint32_t APB1ENR;
  __IO uint32_t BDCR;
  __IO uint32_t CSR;
} RCC_TypeDef;

/**
  * @brief Real-Time Clock
  */
typedef struct
{
  __IO uint32_t CRH;
  __IO uint32_t CRL;
  __IO uint32_t PRLH;
  __IO uint32_t PRLL;
  __IO uint32_t DIVH;
  __IO uint32_t DIVL;
  __IO uint32_t CNTH;
  __IO uint32_t CNTL;
  __IO uint32_t ALRH;
  __IO uint32_t ALRL;
} RTC_TypeDef;

/**
  * @brief Serial Peripheral Interface
  */
typedef struct
{
  __IO uint16_t CR1;
  uint16_t  RESERVED0;
  __IO uint16_t CR2;
  uint16_t  RESERVED1;
  __IO uint16_t SR;
  uint16_t  RESERVED2;
  __IO uint16_t DR;
  uint16_t  RESERVED3;
  __IO uint16_t CRCPR;
  uint16_t  RESERVED4;
  __IO uint16_t RXCRCR;
  uint16_t  RESERVED5;
  __IO uint16_t TXCRCR;
  uint16_t  RESERVED6;
  __IO uint16_t I2SCFGR;
  uint16_t  RESERVED7;
  __IO uint16_t I2SPR;
  uint16_t  RESERVED8;
} SPI_TypeDef;

/**
  * @brief TIM Timers
  */
typedef struct
{
  __IO uint16_t CR1;
  uint16_t  RESERVED0;
  __IO uint16_t CR2;
  uint16_t  RESERVED1;
  __IO uint16_t SMCR;
  uint16_t  RESERVED2;
  __IO uint16_t DIER;
  uint16_t  RESERVED3;
  __IO uint16_t SR;
  uint16_t  RESERVED4;
  __IO uint16_t EGR;
  uint16_t  RESERVED5;
  __IO uint16_t CCMR1;
  uint16_t  RESERVED6;
  __IO uint16_t CCMR2;
  uint16_t  RESERVED7;
  __IO uint16_t CCER;
  uint16_t  RESERVED8;
  __IO uint16_t CNT;
  uint16_t  RESERVED9;
  __IO uint16_t PSC;
  uint16_t  RESERVED10;
  __IO uint16_t ARR;
  uint16_t  RESERVED11;
  __IO uint16_t RCR;
  uint16_t  RESERVED12;
  __IO uint16_t CCR1;
  uint16_t  RESERVED13;
  __IO uint16_t CCR2;
  uint16_t  RESERVED14;
  __IO uint16_t CCR3;
  uint16_t  RESERVED15;
  __IO uint16_t CCR4;
  uint16_t  RESERVED16;
  __IO uint16_t BDTR;
  uint16_t  RESERVED17;
  __IO uint16_t DCR;
  uint16_t  RESERVED18;
  __IO uint16_t DMAR;
  uint16_t  RESERVED19;
} TIM_TypeDef;

/**
  * @brief Universal Synchronous Asynchronous Receiver Transmitter
  */
typedef struct
{
  __IO uint16_t SR;
  uint16_t  RESERVED0;
  __IO uint16_t DR;
  uint16_t  RESERVED1;
  __IO uint16_t BRR;
  uint16_t  RESERVED2;
  __IO uint16_t CR1;
  uint16_t  RESERVED3;
  __IO uint16_t CR2;
  uint16_t  RESERVED4;
  __IO uint16_t CR3;
  uint16_t  RESERVED5;
  __IO uint16_t GTPR;
  uint16_t  RESERVED6;
} USART_TypeDef;

/**
  * @brief Window WATCHDOG
  */
typedef struct
{
  __IO uint32_t CR;
  __IO uint32_t CFR;
  __IO uint32_t SR;
} WWDG_TypeDef;

/**
  * @}
  */

/** @addtogroup Peripheral_memory_map
  * @{
  */

#define FLASH_BASE            0x08000000UL /*!< FLASH base address in the alias region */
#define SRAM_BASE             0x20000000UL /*!< SRAM base address in the alias region */
#define PERIPH_BASE           0x40000000UL /*!< Peripheral base address in the alias region */

#define SRAM_BB_BASE          0x22000000UL /*!< SRAM base address in the bit-banding region */
#define PERIPH_BB_BASE        0x42000000UL /*!< Peripheral base address in the bit-banding region */

#define APB1PERIPH_BASE       PERIPH_BASE
#define APB2PERIPH_BASE       (PERIPH_BASE + 0x10000UL)
#define AHBPERIPH_BASE        (PERIPH_BASE + 0x20000UL)

#define TIM2_BASE             (APB1PERIPH_BASE + 0x0000UL)
#define TIM3_BASE             (APB1PERIPH_BASE + 0x0400UL)
#define TIM4_BASE             (APB1PERIPH_BASE + 0x0800UL)
#define RTC_BASE              (APB1PERIPH_BASE + 0x2800UL)
#define WWDG_BASE             (APB1PERIPH_BASE + 0x2C00UL)
#define IWDG_BASE             (APB1PERIPH_BASE + 0x3000UL)
#define SPI2_BASE             (APB1PERIPH_BASE + 0x3800UL)
#define USART2_BASE           (APB1PERIPH_BASE + 0x4400UL)
#define USART3_BASE           (APB1PERIPH_BASE + 0x4800UL)
#define I2C1_BASE             (APB1PERIPH_BASE + 0x5400UL)
#define I2C2_BASE             (APB1PERIPH_BASE + 0x5800UL)
#define CAN1_BASE             (APB1PERIPH_BASE + 0x6400UL)
#define BKP_BASE              (APB1PERIPH_BASE + 0x6C00UL)
#define PWR_BASE              (APB1PERIPH_BASE + 0x7000UL)

#define AFIO_BASE             (APB2PERIPH_BASE + 0x0000UL)
#define EXTI_BASE             (APB2PERIPH_BASE + 0x0400UL)
#define GPIOA_BASE            (APB2PERIPH_BASE + 0x0800UL)
#define GPIOB_BASE            (APB2PERIPH_BASE + 0x0C00UL)
#define GPIOC_BASE            (APB2PERIPH_BASE + 0x1000UL)
#define GPIOD_BASE            (APB2PERIPH_BASE + 0x1400UL)
#define GPIOE_BASE            (APB2PERIPH_BASE + 0x1800UL)
#define ADC1_BASE             (APB2PERIPH_BASE + 0x2400UL)
#define ADC2_BASE             (APB2PERIPH_BASE + 0x2800UL)
#define TIM1_BASE             (APB2PERIPH_BASE + 0x2C00UL)
#define SPI1_BASE             (APB2PERIPH_BASE + 0x3000UL)
#define USART1_BASE           (APB2PERIPH_BASE + 0x3800UL)

#define DMA1_BASE             (AHBPERIPH_BASE + 0x0000UL)
#define DMA1_Channel1_BASE    (AHBPERIPH_BASE + 0x0008UL)
#define DMA1_Channel2_BASE    (AHBPERIPH_BASE + 0x001CUL)
#define DMA1_Channel3_BASE    (AHBPERIPH_BASE + 0x0030UL)
#define DMA1_Channel4_BASE    (AHBPERIPH_BASE + 0x0044UL)
#define DMA1_Channel5_BASE    (AHBPERIPH_BASE + 0x0058UL)
#define DMA1_Channel6_BASE    (AHBPERIPH_BASE + 0x006CUL)
#define DMA1_Channel7_BASE    (AHBPERIPH_BASE + 0x0080UL)
#define RCC_BASE              (AHBPERIPH_BASE + 0x1000UL)
#define CRC_BASE              (AHBPERIPH_BASE + 0x3000UL)

#define FLASH_R_BASE          (AHBPERIPH_BASE + 0x2000UL)
#define OB_BASE               0x1FFFF800UL

#define DBGMCU_BASE           0xE0042000UL

/**
  * @}
  */

/** @addtogroup Peripheral_declaration
  * @{
  */

#define TIM2                ((TIM_TypeDef *) TIM2_BASE)
#define TIM3                ((TIM_TypeDef *) TIM3_BASE)
#define TIM4                ((TIM_TypeDef *) TIM4_BASE)
#define RTC                 ((RTC_TypeDef *) RTC_BASE)
#define WWDG                ((WWDG_TypeDef *) WWDG_BASE)
#define IWDG                ((IWDG_TypeDef *) IWDG_BASE)
#define SPI2                ((SPI_TypeDef *) SPI2_BASE)
#define USART2              ((USART_TypeDef *) USART2_BASE)
#define USART3              ((USART_TypeDef *) USART3_BASE)
#define I2C1                ((I2C_TypeDef *) I2C1_BASE)
#define I2C2                ((I2C_TypeDef *) I2C2_BASE)
#define CAN1                ((CAN_TypeDef *) CAN1_BASE)
#define BKP                 ((BKP_TypeDef *) BKP_BASE)
#define PWR                 ((PWR_TypeDef *) PWR_BASE)

#define AFIO                ((AFIO_TypeDef *) AFIO_BASE)
#define EXTI                ((EXTI_TypeDef *) EXTI_BASE)
#define GPIOA               ((GPIO_TypeDef *) GPIOA_BASE)
#define GPIOB               ((GPIO_TypeDef *) GPIOB_BASE)
#define GPIOC               ((GPIO_TypeDef *) GPIOC_BASE)
#define GPIOD               ((GPIO_TypeDef *) GPIOD_BASE)
#define GPIOE               ((GPIO_TypeDef *) GPIOE_BASE)
#define ADC1                ((ADC_TypeDef *) ADC1_BASE)
#define ADC2                ((ADC_TypeDef *) ADC2_BASE)
#define TIM1                ((TIM_TypeDef *) TIM1_BASE)
#define SPI1                ((SPI_TypeDef *) SPI1_BASE)
#define USART1              ((USART_TypeDef *) USART1_BASE)

#define DMA1                ((DMA_TypeDef *) DMA1_BASE)
#define DMA1_Channel1       ((DMA_Channel_TypeDef *) DMA1_Channel1_BASE)
#define DMA1_Channel2       ((DMA_Channel_TypeDef *) DMA1_Channel2_BASE)
#define DMA1_Channel3       ((DMA_Channel_TypeDef *) DMA1_Channel3_BASE)
#define DMA1_Channel4       ((DMA_Channel_TypeDef *) DMA1_Channel4_BASE)
#define DMA1_Channel5       ((DMA_Channel_TypeDef *) DMA1_Channel5_BASE)
#define DMA1_Channel6       ((DMA_Channel_TypeDef *) DMA1_Channel6_BASE)
#define DMA1_Channel7       ((DMA_Channel_TypeDef *) DMA1_Channel7_BASE)
#define RCC                 ((RCC_TypeDef *) RCC_BASE)
#define CRC                 ((CRC_TypeDef *) CRC_BASE)

#define FLASH               ((FLASH_TypeDef *) FLASH_R_BASE)
#define OB                  ((OB_TypeDef *) OB_BASE)

#define DBGMCU              ((DBGMCU_TypeDef *) DBGMCU_BASE)

/**
  * @}
  */

/** @addtogroup Exported_constants
  * @{
  */

/** @addtogroup Peripheral_Registers_Bits_Definition
  * @{
  */

/******************************************************************************/
/*                         Peripheral Registers_Bits_Definition               */
/******************************************************************************/

/******************************************************************************/
/*                                                                            */
/*                        Analog to Digital Converter                         */
/*                                                                            */
/******************************************************************************/

/********************  Bit definition for ADC_SR register  ********************/
#define ADC_SR_AWD_Pos            (0U)
#define ADC_SR_AWD_Msk            (0x1UL << ADC_SR_AWD_Pos)
#define ADC_SR_AWD                ADC_SR_AWD_Msk
#define ADC_SR_EOC_Pos            (1U)
#define ADC_SR_EOC_Msk            (0x1UL << ADC_SR_EOC_Pos)
#define ADC_SR_EOC                ADC_SR_EOC_Msk
#define ADC_SR_JEOC_Pos           (2U)
#define ADC_SR_JEOC_Msk           (0x1UL << ADC_SR_JEOC_Pos)
#define ADC_SR_JEOC               ADC_SR_JEOC_Msk
#define ADC_SR_JSTRT_Pos          (3U)
#define ADC_SR_JSTRT_Msk          (0x1UL << ADC_SR_JSTRT_Pos)
#define ADC_SR_JSTRT              ADC_SR_JSTRT_Msk
#define ADC_SR_STRT_Pos           (4U)
#define ADC_SR_STRT_Msk           (0x1UL << ADC_SR_STRT_Pos)
#define ADC_SR_STRT               ADC_SR_STRT_Msk

/*******************  Bit definition for ADC_CR1 register  ********************/
#define ADC_CR1_AWDCH_Pos         (0U)
#define ADC_CR1_AWDCH_Msk         (0x1FUL << ADC_CR1_AWDCH_Pos)
#define ADC_CR1_AWDCH             ADC_CR1_AWDCH_Msk
#define ADC_CR1_EOCIE_Pos         (5U)
#define ADC_CR1_EOCIE_Msk         (0x1UL << ADC_CR1_EOCIE_Pos)
#define ADC_CR1_EOCIE             ADC_CR1_EOCIE_Msk
#define ADC_CR1_AWDIE_Pos         (6U)
#define ADC_CR1_AWDIE_Msk         (0x1UL << ADC_CR1_AWDIE_Pos)
#define ADC_CR1_AWDIE             ADC_CR1_AWDIE_Msk
#define ADC_CR1_JEOCIE_Pos        (7U)
#define ADC_CR1_JEOCIE_Msk        (0x1UL << ADC_CR1_JEOCIE_Pos)
#define ADC_CR1_JEOCIE            ADC_CR1_JEOCIE_Msk
#define ADC_CR1_SCAN_Pos          (8U)
#define ADC_CR1_SCAN_Msk          (0x1UL << ADC_CR1_SCAN_Pos)
#define ADC_CR1_SCAN              ADC_CR1_SCAN_Msk
#define ADC_CR1_AWDSGL_Pos        (9U)
#define ADC_CR1_AWDSGL_Msk        (0x1UL << ADC_CR1_AWDSGL_Pos)
#define ADC_CR1_AWDSGL            ADC_CR1_AWDSGL_Msk
#define ADC_CR1_JAUTO_Pos         (10U)
#define ADC_CR1_JAUTO_Msk         (0x1UL << ADC_CR1_JAUTO_Pos)
#define ADC_CR1_JAUTO             ADC_CR1_JAUTO_Msk
#define ADC_CR1_DISCEN_Pos        (11U)
#define ADC_CR1_DISCEN_Msk        (0x1UL << ADC_CR1_DISCEN_Pos)
#define ADC_CR1_DISCEN            ADC_CR1_DISCEN_Msk
#define ADC_CR1_JDISCEN_Pos       (12U)
#define ADC_CR1_JDISCEN_Msk       (0x1UL << ADC_CR1_JDISCEN_Pos)
#define ADC_CR1_JDISCEN           ADC_CR1_JDISCEN_Msk
#define ADC_CR1_DISCNUM_Pos       (13U)
#define ADC_CR1_DISCNUM_Msk       (0x7UL << ADC_CR1_DISCNUM_Pos)
#define ADC_CR1_DISCNUM           ADC_CR1_DISCNUM_Msk
#define ADC_CR1_JAWDEN_Pos        (22U)
#define ADC_CR1_JAWDEN_Msk        (0x1UL << ADC_CR1_JAWDEN_Pos)
#define ADC_CR1_JAWDEN            ADC_CR1_JAWDEN_Msk
#define ADC_CR1_AWDEN_Pos         (23U)
#define ADC_CR1_AWDEN_Msk         (0x1UL << ADC_CR1_AWDEN_Pos)
#define ADC_CR1_AWDEN             ADC_CR1_AWDEN_Msk

/*******************  Bit definition for ADC_CR2 register  ********************/
#define ADC_CR2_ADON_Pos          (0U)
#define ADC_CR2_ADON_Msk          (0x1UL << ADC_CR2_ADON_Pos)
#define ADC_CR2_ADON              ADC_CR2_ADON_Msk
#define ADC_CR2_CONT_Pos          (1U)
#define ADC_CR2_CONT_Msk          (0x1UL << ADC_CR2_CONT_Pos)
#define ADC_CR2_CONT              ADC_CR2_CONT_Msk
#define ADC_CR2_CAL_Pos           (2U)
#define ADC_CR2_CAL_Msk           (0x1UL << ADC_CR2_CAL_Pos)
#define ADC_CR2_CAL               ADC_CR2_CAL_Msk
#define ADC_CR2_RSTCAL_Pos        (3U)
#define ADC_CR2_RSTCAL_Msk        (0x1UL << ADC_CR2_RSTCAL_Pos)
#define ADC_CR2_RSTCAL            ADC_CR2_RSTCAL_Msk
#define ADC_CR2_DMA_Pos           (8U)
#define ADC_CR2_DMA_Msk           (0x1UL << ADC_CR2_DMA_Pos)
#define ADC_CR2_DMA               ADC_CR2_DMA_Msk
#define ADC_CR2_ALIGN_Pos         (11U)
#define ADC_CR2_ALIGN_Msk         (0x1UL << ADC_CR2_ALIGN_Pos)
#define ADC_CR2_ALIGN             ADC_CR2_ALIGN_Msk
#define ADC_CR2_JEXTSEL_Pos       (12U)
#define ADC_CR2_JEXTSEL_Msk       (0x7UL << ADC_CR
