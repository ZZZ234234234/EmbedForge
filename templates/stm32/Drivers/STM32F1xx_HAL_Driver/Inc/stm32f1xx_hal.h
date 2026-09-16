/**
  ******************************************************************************
  * @file    stm32f1xx_hal.h
  * @brief   HAL 主头文件，聚合所有 HAL 模块头文件与全局定义。
  ******************************************************************************
  */

#ifndef __STM32F1xx_HAL_H
#define __STM32F1xx_HAL_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include "stm32f1xx_hal_conf.h"

/* Exported types ------------------------------------------------------------*/

/**
  * @brief  HAL 状态枚举
  */
typedef enum
{
  HAL_OK      = 0x00U,
  HAL_ERROR   = 0x01U,
  HAL_BUSY    = 0x02U,
  HAL_TIMEOUT = 0x03U
} HAL_StatusTypeDef;

/**
  * @brief  HAL 锁定状态枚举
  */
typedef enum
{
  HAL_UNLOCKED = 0x00U,
  HAL_LOCKED   = 0x01U
} HAL_LockTypeDef;

/* Exported constants --------------------------------------------------------*/

#ifndef UNUSED
#define UNUSED(X) ((void)(X))
#endif

#define HAL_MAX_DELAY      0xFFFFFFFFU

#define HAL_UUID_WORD_LEN  4U

/* Exported macro ------------------------------------------------------------*/

/**
  * @brief  使能中断（清除 PRIMASK）
  */
#define __HAL_ENABLE_INTERRUPTS()   __enable_irq()

/**
  * @brief  关闭中断（置位 PRIMASK）
  */
#define __HAL_DISABLE_INTERRUPTS()  __disable_irq()

/**
  * @brief  读取 PRIMASK 中断屏蔽状态
  */
#define __HAL_GET_PRIMASK()         __get_PRIMASK()

/**
  * @brief  设置 PRIMASK
  */
#define __HAL_SET_PRIMASK(__PRI__)  __set_PRIMASK(__PRI__)

/* Exported functions --------------------------------------------------------*/

/**
  * @brief  初始化 HAL 库（复位所有外设、初始化 Flash 接口与 SysTick）。
  * @retval HAL 状态
  */
HAL_StatusTypeDef HAL_Init(void);

/**
  * @brief  反初始化 HAL 库（复位所有外设、关闭 SysTick）。
  * @retval HAL 状态
  */
HAL_StatusTypeDef HAL_DeInit(void);

/**
  * @brief  初始化 MSP（MCU 支持包，时钟/中断/NVIC 等底层配置）。
  * @note   由 HAL_Init 内部调用，用户需在 stm32f1xx_hal_msp.c 中实现。
  */
void HAL_MspInit(void);

/**
  * @brief  反初始化 MSP。
  */
void HAL_MspDeInit(void);

/**
  * @brief  使能 DBGMCU 调试模块（低功耗模式下保持调试连接）。
  * @param  DBGMCU_Config 调试配置位
  */
void HAL_DBGMCU_EnableDBGSleepMode(void);
void HAL_DBGMCU_DisableDBGSleepMode(void);
void HAL_DBGMCU_EnableDBGStopMode(void);
void HAL_DBGMCU_DisableDBGStopMode(void);
void HAL_DBGMCU_EnableDBGStandbyMode(void);
void HAL_DBGMCU_DisableDBGStandbyMode(void);

/**
  * @brief  返回 HAL 库版本号。
  * @retval 版本号（0xMMmmpp 格式）
  */
uint32_t HAL_GetHalVersion(void);

/**
  * @brief  返回设备唯一 ID 低 32 位。
  */
uint32_t HAL_GetUIDw0(void);

/**
  * @brief  返回设备唯一 ID 中 32 位。
  */
uint32_t HAL_GetUIDw1(void);

/**
  * @brief  返回设备唯一 ID 高 32 位。
  */
uint32_t HAL_GetUIDw2(void);

/**
  * @brief  返回 REV_ID 寄存器值。
  */
uint32_t HAL_GetREVID(void);

/**
  * @brief  返回 DEV_ID 寄存器值。
  */
uint32_t HAL_GetDEVID(void);

/**
  * @brief  使能 DBGMCU 低功耗调试。
  */
void HAL_DBGMCU_EnableDBGSleepMode(void);

/**
  * @brief  基于 SysTick 的毫秒级延时（阻塞）。
  * @param  Delay 延时毫秒数
  */
void HAL_Delay(uint32_t Delay);

/**
  * @brief  返回自 HAL_Init 以来的毫秒计数（溢出回绕）。
  * @retval 毫秒计数
  */
uint32_t HAL_GetTick(void);

/**
  * @brief  挂起 SysTick 中断。
  */
void HAL_SuspendTick(void);

/**
  * @brief  恢复 SysTick 中断。
  */
void HAL_ResumeTick(void);

#ifdef __cplusplus
}
#endif

#endif /* __STM32F1xx_HAL_H */
