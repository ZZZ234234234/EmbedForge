/**
  ******************************************************************************
  * @file    stm32f1xx_hal_msp.c
  * @brief   MSP (MCU Support Package) 初始化/反初始化回调实现。
  *          本文件实现 HAL 弱回调，用于配置外设底层硬件资源：
  *          - 外设时钟使能/禁用
  *          - GPIO 引脚复用与电气属性配置
  *          - NVIC 中断优先级配置
  ******************************************************************************
  */

#include "main.h"

/* 私有函数原型 ------------------------------------------------------------*/
static void HAL_MspInit_EnableDebugPins(void);

/**
  * @brief  全局 MSP 初始化，在 HAL_Init() 内部被调用。
  *         此处完成与具体外设无关的底层初始化：
  *         - 使能 AFIO 时钟（F1 系列重映射/EXTI 需要）
  *         - 使能 PWR 时钟（后续若使用低功耗模式需要）
  *         - 配置 SWD 调试引脚，保留调试能力
  * @note   必须在任何外设初始化之前完成。
  */
void HAL_MspInit(void)
{
    __HAL_RCC_AFIO_CLK_ENABLE();
    __HAL_RCC_PWR_CLK_ENABLE();

    /* 保留 SWD 调试接口：PA13(SWDIO) / PA14(SWCLK)。
     * F1 系列通过 AFIO_MAPR 的 SWJ_CFG 位选择调试口复用方式。
     * 这里选择 "JTAG-DP Disabled and SW-DP Enabled"，
     * 释放 PA15/PB3/PB4 作为普通 GPIO，同时保留 SWD 下载/调试能力。 */
    HAL_MspInit_EnableDebugPins();
}

/**
  * @brief  配置 SWJ 调试口复用，仅保留 SWD。
  */
static void HAL_MspInit_EnableDebugPins(void)
{
    /* 先使能复用功能时钟（AFIO），再修改 MAPR 寄存器 */
    __HAL_AFIO_REMAP_SWJ_NOJTAG();
}

/**
  * @brief  GPIO 外设 MSP 初始化回调。
  *         由 HAL_GPIO_Init() 在配置引脚前调用。
  *         本工程 GPIO 时钟已在 app_led_init() 中显式使能，
  *         此处仅作为 HAL 回调占位，保持接口完整性。
  * @param  GPIOx: GPIO 端口基地址
  */
void HAL_GPIO_MspInit(GPIO_TypeDef *GPIOx)
{
    (void)GPIOx;
    /* GPIO 时钟使能由应用层负责（app_led_init），
     * 避免 HAL 回调与应用层重复使能造成职责不清。 */
}

/**
  * @brief  GPIO 外设 MSP 反初始化回调。
  * @param  GPIOx: GPIO 端口基地址
  */
void HAL_GPIO_MspDeInit(GPIO_TypeDef *GPIOx)
{
    (void)GPIOx;
    /* 本工程无 GPIO 反初始化需求 */
}

/**
  * @brief  TIM 基础定时器 MSP 初始化回调。
  *         由 HAL_TIM_Base_Init() 调用。
  *         本工程未使用 TIM 外设，保留空实现以兼容 HAL 链接。
  * @param  htim: TIM 句柄
  */
void HAL_TIM_Base_MspInit(TIM_HandleTypeDef *htim)
{
    (void)htim;
}

/**
  * @brief  TIM 基础定时器 MSP 反初始化回调。
  * @param  htim: TIM 句柄
  */
void HAL_TIM_Base_MspDeInit(TIM_HandleTypeDef *htim)
{
    (void)htim;
}

/**
  * @brief  RCC 时钟配置回调（HAL_RCC_ClockConfig 内部调用）。
  *         本工程时钟树在 SystemClock_Config() 中完整配置，
  *         此处无需额外处理。
  * @param  clk_init: 时钟初始化结构体
  * @param  FLatency: Flash 等待周期
  */
void HAL_RCC_ClockConfigCallback(RCC_ClkInitTypeDef *clk_init, uint32_t FLatency)
{
    (void)clk_init;
    (void)FLatency;
}
