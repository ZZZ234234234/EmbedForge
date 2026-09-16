/**
  ******************************************************************************
  * @file    system_stm32f1xx.h
  * @brief   CMSIS Cortex-M3 Device System Source File for STM32F1xx devices.
  ******************************************************************************
  */

#ifndef __SYSTEM_STM32F1XX_H
#define __SYSTEM_STM32F1XX_H

#ifdef __cplusplus
extern "C" {
#endif

#include <stdint.h>

/** @addtogroup STM32F1xx_System
  * @{
  */

/* Exported constants --------------------------------------------------------*/

/** @addtogroup STM32F1xx_System_Exported_Constants
  * @{
  */

/**
  * @brief Uncomment the line below to use the default SystemInit() function
  *        provided by the CMSIS device file. Otherwise, the user must provide
  *        his own SystemInit() function.
  */
/* #define USER_VECT_TAB_ADDRESS */

/**
  * @brief Vector Table base offset field.
  *        This value must be a multiple of 0x200.
  */
#if defined(USER_VECT_TAB_ADDRESS)
#define VECT_TAB_OFFSET  0x00000000U
#endif

/**
  * @}
  */

/* Exported variables --------------------------------------------------------*/

/** @addtogroup STM32F1xx_System_Exported_Variables
  * @{
  */

/**
  * @brief System Clock Frequency (Core Clock)
  */
extern uint32_t SystemCoreClock;

/**
  * @}
  */

/* Exported functions --------------------------------------------------------*/

/** @addtogroup STM32F1xx_System_Exported_Functions
  * @{
  */

/**
  * @brief  Setup the microcontroller system.
  *         Initialize the Embedded Flash Interface, the PLL and update the
  *         SystemCoreClock variable.
  * @note   This function should be used only after reset.
  * @param  None
  * @retval None
  */
void SystemInit(void);

/**
  * @brief  Update SystemCoreClock variable according to Clock Register Values.
  *         The SystemCoreClock variable contains the core clock (HCLK), it can
  *         be used by the user application to setup the SysTick timer or
  *         configure other parameters.
  * @note   Each time the core clock (HCLK) changes, this function must be called
  *         to update SystemCoreClock variable value. Otherwise, any
  *         configuration based on this variable will be incorrect.
  * @param  None
  * @retval None
  */
void SystemCoreClockUpdate(void);

/**
  * @}
  */

/**
  * @}
  */

#ifdef __cplusplus
}
#endif

#endif /* __SYSTEM_STM32F1XX_H */
