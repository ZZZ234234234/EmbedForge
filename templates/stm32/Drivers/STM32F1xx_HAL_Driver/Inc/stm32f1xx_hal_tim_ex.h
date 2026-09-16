```c
/**
  ******************************************************************************
  * @file    stm32f1xx_hal_tim_ex.h
  * @author  MCD Application Team
  * @brief   Header file of TIM HAL Extended module.
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
#ifndef STM32F1xx_HAL_TIM_EX_H
#define STM32F1xx_HAL_TIM_EX_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include "stm32f1xx_hal_def.h"

/** @addtogroup STM32F1xx_HAL_Driver
  * @{
  */

/** @addtogroup TIMEx
  * @{
  */

/* Exported types ------------------------------------------------------------*/
/** @defgroup TIMEx_Exported_Types TIM Extended Exported Types
  * @{
  */

/**
  * @brief  TIM Hall sensor Configuration Structure definition
  */
typedef struct
{
  uint32_t IC1Polarity;         /*!< Specifies the active edge of the input signal.
                                     This parameter can be a value of @ref TIM_Input_Capture_Polarity */

  uint32_t IC1Prescaler;        /*!< Specifies the Input Capture Prescaler.
                                     This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t IC1Filter;           /*!< Specifies the input capture filter.
                                     This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */

  uint32_t Commutation_Delay;   /*!< Specifies the pulse value to be loaded into the Capture Compare Register.
                                     This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */
} TIM_HallSensor_InitTypeDef;

/**
  * @brief  TIM Break input(s) and Dead time configuration Structure definition
  * @note   2 break inputs can be configured (BKIN and BKIN2) with configurable
  *        filter and polarity.
  */
typedef struct
{
  uint32_t OffStateRunMode;     /*!< TIM off state in run mode, This parameter can be a value of @ref TIM_OSSR_Off_State_Selection_for_Run_mode_state */

  uint32_t OffStateIDLEMode;    /*!< TIM off state in IDLE mode, This parameter can be a value of @ref TIM_OSSI_Off_State_Selection_for_Idle_mode_state */

  uint32_t LockLevel;           /*!< TIM Lock level, This parameter can be a value of @ref TIM_Lock_level */

  uint32_t DeadTime;            /*!< TIM dead Time, This parameter can be a number between Min_Data = 0x00 and Max_Data = 0xFF */

  uint32_t BreakState;          /*!< TIM Break State, This parameter can be a value of @ref TIM_Break_Input_enable_disable */

  uint32_t BreakPolarity;       /*!< TIM Break input polarity, This parameter can be a value of @ref TIM_Break_Polarity */

  uint32_t AutomaticOutput;     /*!< TIM Automatic Output Enable state, This parameter can be a value of @ref TIM_AOE_Bit_Set_Reset */
} TIM_BreakDeadTimeConfigTypeDef;

/**
  * @brief  TIM Master configuration Structure definition
  */
typedef struct
{
  uint32_t  MasterOutputTrigger;   /*!< Trigger output (TRGO) selection.
                                        This parameter can be a value of @ref TIM_Master_Mode_Selection */

  uint32_t  MasterSlaveMode;       /*!< Master/slave mode selection.
                                        This parameter can be a value of @ref TIM_Master_Slave_Mode */
} TIM_MasterConfigTypeDef;

/**
  * @brief  TIM Slave configuration Structure definition
  */
typedef struct
{
  uint32_t  SlaveMode;         /*!< Slave mode selection.
                                    This parameter can be a value of @ref TIM_Slave_Mode */

  uint32_t  InputTrigger;      /*!< Input Trigger source.
                                    This parameter can be a value of @ref TIM_Trigger_Selection */

  uint32_t  TriggerPolarity;   /*!< Input Trigger polarity.
                                    This parameter can be a value of @ref TIM_Trigger_Polarity */

  uint32_t  TriggerPrescaler;  /*!< Input trigger prescaler.
                                    This parameter can be a value of @ref TIM_Trigger_Prescaler */

  uint32_t  TriggerFilter;     /*!< Input trigger filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_SlaveConfigTypeDef;

/**
  * @brief  TIM Input Capture configuration Structure definition
  */
typedef struct
{
  uint32_t  ICPolarity;        /*!< Specifies the active edge of the input signal.
                                    This parameter can be a value of @ref TIM_Input_Capture_Polarity */

  uint32_t ICSelection;        /*!< Specifies the input.
                                    This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t ICPrescaler;        /*!< Specifies the Input Capture Prescaler.
                                    This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t ICFilter;           /*!< Specifies the input capture filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_IC_InitTypeDef;

/**
  * @brief  TIM Encoder configuration Structure definition
  */
typedef struct
{
  uint32_t EncoderMode;        /*!< Specifies the encoder mode.
                                    This parameter can be a value of @ref TIM_Encoder_Mode */

  uint32_t IC1Polarity;        /*!< Specifies the active edge of the input signal.
                                    This parameter can be a value of @ref TIM_Encoder_Input_Polarity */

  uint32_t IC1Selection;       /*!< Specifies the input.
                                    This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t IC1Prescaler;       /*!< Specifies the Input Capture Prescaler.
                                    This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t IC1Filter;          /*!< Specifies the input capture filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */

  uint32_t IC2Polarity;        /*!< Specifies the active edge of the input signal.
                                    This parameter can be a value of @ref TIM_Encoder_Input_Polarity */

  uint32_t IC2Selection;       /*!< Specifies the input.
                                    This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t IC2Prescaler;       /*!< Specifies the Input Capture Prescaler.
                                    This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t IC2Filter;          /*!< Specifies the input capture filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_Encoder_InitTypeDef;

/**
  * @brief  TIM Clock Configuration Handle Structure definition
  */
typedef struct
{
  uint32_t ClockSource;     /*!< TIM clock sources.
                                 This parameter can be a value of @ref TIM_Clock_Source */

  uint32_t ClockPolarity;   /*!< TIM clock polarity.
                                 This parameter can be a value of @ref TIM_Clock_Polarity */

  uint32_t ClockPrescaler;  /*!< TIM clock prescaler.
                                 This parameter can be a value of @ref TIM_Clock_Prescaler */

  uint32_t ClockFilter;     /*!< TIM clock filter.
                                 This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_ClockConfigTypeDef;

/**
  * @brief  TIM Clear Input configuration Handle Structure definition
  */
typedef struct
{
  uint32_t ClearInputState;      /*!< TIM clear Input state.
                                      This parameter can be ENABLE or DISABLE */

  uint32_t ClearInputSource;     /*!< TIM clear Input sources.
                                      This parameter can be a value of @ref TIM_ClearInput_Source */

  uint32_t ClearInputPolarity;   /*!< TIM Clear Input polarity.
                                      This parameter can be a value of @ref TIM_ClearInput_Polarity */

  uint32_t ClearInputPrescaler;  /*!< TIM Clear Input prescaler.
                                      This parameter must be 0: When OCRef clear feature is used with ETR source,
                                      ETR prescaler must be off */

  uint32_t ClearInputFilter;     /*!< TIM Clear Input filter.
                                      This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_ClearInputConfigTypeDef;

/**
  * @brief  TIM Output Compare fast Config Structure definition
  */
typedef struct
{
  uint32_t FastMode;           /*!< TIM fast mode state.
                                    This parameter can be a value of @ref TIM_Output_Fast_State */

  uint32_t OC1Polarity;        /*!< TIM Output Compare 1 polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OC1NPolarity;       /*!< TIM Output Compare 1 complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OC2Polarity;        /*!< TIM Output Compare 2 polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OC2NPolarity;       /*!< TIM Output Compare 2 complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OC3Polarity;        /*!< TIM Output Compare 3 polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OC3NPolarity;       /*!< TIM Output Compare 3 complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OC4Polarity;        /*!< TIM Output Compare 4 polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */
} TIM_OCFastConfigTypeDef;

/**
  * @brief  TIM Output Compare config Structure definition
  */
typedef struct
{
  uint32_t OCMode;             /*!< TIM Output Compare mode.
                                    This parameter can be a value of @ref TIM_Output_Compare_and_PWM_modes */

  uint32_t Pulse;              /*!< TIM Pulse value.
                                    This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */

  uint32_t OCPolarity;         /*!< TIM Output Compare polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OCNPolarity;        /*!< TIM Output Compare complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OCFastMode;         /*!< TIM Output Compare fast mode.
                                    This parameter can be a value of @ref TIM_Output_Fast_State */

  uint32_t OCIdleState;        /*!< TIM Output Compare idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_Idle_State */

  uint32_t OCNIdleState;       /*!< TIM Output Compare complementary idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Idle_State */
} TIM_OC_InitTypeDef;

/**
  * @brief  TIM One Pulse Mode configuration Structure definition
  */
typedef struct
{
  uint32_t OCMode;             /*!< TIM Output Compare mode.
                                    This parameter can be a value of @ref TIM_Output_Compare_and_PWM_modes */

  uint32_t Pulse;              /*!< TIM Pulse value.
                                    This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */

  uint32_t OCPolarity;         /*!< TIM Output Compare polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OCNPolarity;        /*!< TIM Output Compare complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OCIdleState;        /*!< TIM Output Compare idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_Idle_State */

  uint32_t OCNIdleState;       /*!< TIM Output Compare complementary idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Idle_State */

  uint32_t ICPolarity;         /*!< TIM Input Capture polarity.
                                    This parameter can be a value of @ref TIM_Input_Capture_Polarity */

  uint32_t ICSelection;        /*!< TIM Input Capture selection.
                                    This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t ICFilter;           /*!< TIM Input Capture filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_OnePulse_InitTypeDef;

/**
  * @brief  TIM Output Compare config Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t OCMode;             /*!< TIM Output Compare mode.
                                    This parameter can be a value of @ref TIM_Output_Compare_and_PWM_modes */

  uint32_t Pulse;              /*!< TIM Pulse value.
                                    This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */

  uint32_t OCPolarity;         /*!< TIM Output Compare polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OCNPolarity;        /*!< TIM Output Compare complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OCIdleState;        /*!< TIM Output Compare idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_Idle_State */

  uint32_t OCNIdleState;       /*!< TIM Output Compare complementary idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Idle_State */

  uint32_t OCFastMode;         /*!< TIM Output Compare fast mode.
                                    This parameter can be a value of @ref TIM_Output_Fast_State */
} TIM_OC_InitTypeDef_Adv;

/**
  * @brief  TIM PWM Configuration Structure definition
  */
typedef struct
{
  uint32_t Pulse;              /*!< TIM Pulse value.
                                    This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */

  uint32_t OCMode;             /*!< TIM Output Compare mode.
                                    This parameter can be a value of @ref TIM_Output_Compare_and_PWM_modes */

  uint32_t OCPolarity;         /*!< TIM Output Compare polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OCNPolarity;        /*!< TIM Output Compare complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OCFastMode;         /*!< TIM Output Compare fast mode.
                                    This parameter can be a value of @ref TIM_Output_Fast_State */

  uint32_t OCIdleState;        /*!< TIM Output Compare idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_Idle_State */

  uint32_t OCNIdleState;       /*!< TIM Output Compare complementary idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Idle_State */
} TIM_PWM_InitTypeDef;

/**
  * @brief  TIM Input Capture configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t ICPolarity;         /*!< Specifies the active edge of the input signal.
                                    This parameter can be a value of @ref TIM_Input_Capture_Polarity */

  uint32_t ICSelection;        /*!< Specifies the input.
                                    This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t ICPrescaler;        /*!< Specifies the Input Capture Prescaler.
                                    This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t ICFilter;           /*!< Specifies the input capture filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_IC_InitTypeDef_Adv;

/**
  * @brief  TIM Encoder configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t EncoderMode;        /*!< Specifies the encoder mode.
                                    This parameter can be a value of @ref TIM_Encoder_Mode */

  uint32_t IC1Polarity;        /*!< Specifies the active edge of the input signal.
                                    This parameter can be a value of @ref TIM_Encoder_Input_Polarity */

  uint32_t IC1Selection;       /*!< Specifies the input.
                                    This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t IC1Prescaler;       /*!< Specifies the Input Capture Prescaler.
                                    This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t IC1Filter;          /*!< Specifies the input capture filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */

  uint32_t IC2Polarity;        /*!< Specifies the active edge of the input signal.
                                    This parameter can be a value of @ref TIM_Encoder_Input_Polarity */

  uint32_t IC2Selection;       /*!< Specifies the input.
                                    This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t IC2Prescaler;       /*!< Specifies the Input Capture Prescaler.
                                    This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t IC2Filter;          /*!< Specifies the input capture filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_Encoder_InitTypeDef_Adv;

/**
  * @brief  TIM Hall sensor Configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t IC1Polarity;         /*!< Specifies the active edge of the input signal.
                                     This parameter can be a value of @ref TIM_Input_Capture_Polarity */

  uint32_t IC1Prescaler;        /*!< Specifies the Input Capture Prescaler.
                                     This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t IC1Filter;           /*!< Specifies the input capture filter.
                                     This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */

  uint32_t Commutation_Delay;   /*!< Specifies the pulse value to be loaded into the Capture Compare Register.
                                     This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */
} TIM_HallSensor_InitTypeDef_Adv;

/**
  * @brief  TIM Break input(s) and Dead time configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t OffStateRunMode;     /*!< TIM off state in run mode.
                                     This parameter can be a value of @ref TIM_OSSR_Off_State_Selection_for_Run_mode_state */

  uint32_t OffStateIDLEMode;    /*!< TIM off state in IDLE mode.
                                     This parameter can be a value of @ref TIM_OSSI_Off_State_Selection_for_Idle_mode_state */

  uint32_t LockLevel;           /*!< TIM Lock level.
                                     This parameter can be a value of @ref TIM_Lock_level */

  uint32_t DeadTime;            /*!< TIM dead Time.
                                     This parameter can be a number between Min_Data = 0x00 and Max_Data = 0xFF */

  uint32_t BreakState;          /*!< TIM Break State.
                                     This parameter can be a value of @ref TIM_Break_Input_enable_disable */

  uint32_t BreakPolarity;       /*!< TIM Break input polarity.
                                     This parameter can be a value of @ref TIM_Break_Polarity */

  uint32_t BreakFilter;         /*!< Specifies the break input filter.
                                     This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */

  uint32_t AutomaticOutput;     /*!< TIM Automatic Output Enable state.
                                     This parameter can be a value of @ref TIM_AOE_Bit_Set_Reset */
} TIM_BreakDeadTimeConfigTypeDef_Adv;

/**
  * @brief  TIM Master configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t  MasterOutputTrigger;   /*!< Trigger output (TRGO) selection.
                                        This parameter can be a value of @ref TIM_Master_Mode_Selection */

  uint32_t  MasterSlaveMode;       /*!< Master/slave mode selection.
                                        This parameter can be a value of @ref TIM_Master_Slave_Mode */
} TIM_MasterConfigTypeDef_Adv;

/**
  * @brief  TIM Slave configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t  SlaveMode;         /*!< Slave mode selection.
                                    This parameter can be a value of @ref TIM_Slave_Mode */

  uint32_t  InputTrigger;      /*!< Input Trigger source.
                                    This parameter can be a value of @ref TIM_Trigger_Selection */

  uint32_t  TriggerPolarity;   /*!< Input Trigger polarity.
                                    This parameter can be a value of @ref TIM_Trigger_Polarity */

  uint32_t  TriggerPrescaler;  /*!< Input trigger prescaler.
                                    This parameter can be a value of @ref TIM_Trigger_Prescaler */

  uint32_t  TriggerFilter;     /*!< Input trigger filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_SlaveConfigTypeDef_Adv;

/**
  * @brief  TIM Clock Configuration Handle Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t ClockSource;     /*!< TIM clock sources.
                                 This parameter can be a value of @ref TIM_Clock_Source */

  uint32_t ClockPolarity;   /*!< TIM clock polarity.
                                 This parameter can be a value of @ref TIM_Clock_Polarity */

  uint32_t ClockPrescaler;  /*!< TIM clock prescaler.
                                 This parameter can be a value of @ref TIM_Clock_Prescaler */

  uint32_t ClockFilter;     /*!< TIM clock filter.
                                 This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_ClockConfigTypeDef_Adv;

/**
  * @brief  TIM Clear Input configuration Handle Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t ClearInputState;      /*!< TIM clear Input state.
                                      This parameter can be ENABLE or DISABLE */

  uint32_t ClearInputSource;     /*!< TIM clear Input sources.
                                      This parameter can be a value of @ref TIM_ClearInput_Source */

  uint32_t ClearInputPolarity;   /*!< TIM Clear Input polarity.
                                      This parameter can be a value of @ref TIM_ClearInput_Polarity */

  uint32_t ClearInputPrescaler;  /*!< TIM Clear Input prescaler.
                                      This parameter must be 0: When OCRef clear feature is used with ETR source,
                                      ETR prescaler must be off */

  uint32_t ClearInputFilter;     /*!< TIM Clear Input filter.
                                      This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_ClearInputConfigTypeDef_Adv;

/**
  * @brief  TIM Output Compare fast Config Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t FastMode;           /*!< TIM fast mode state.
                                    This parameter can be a value of @ref TIM_Output_Fast_State */

  uint32_t OC1Polarity;        /*!< TIM Output Compare 1 polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OC1NPolarity;       /*!< TIM Output Compare 1 complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OC2Polarity;        /*!< TIM Output Compare 2 polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OC2NPolarity;       /*!< TIM Output Compare 2 complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OC3Polarity;        /*!< TIM Output Compare 3 polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OC3NPolarity;       /*!< TIM Output Compare 3 complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OC4Polarity;        /*!< TIM Output Compare 4 polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */
} TIM_OCFastConfigTypeDef_Adv;

/**
  * @brief  TIM One Pulse Mode configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t OCMode;             /*!< TIM Output Compare mode.
                                    This parameter can be a value of @ref TIM_Output_Compare_and_PWM_modes */

  uint32_t Pulse;              /*!< TIM Pulse value.
                                    This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */

  uint32_t OCPolarity;         /*!< TIM Output Compare polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OCNPolarity;        /*!< TIM Output Compare complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OCIdleState;        /*!< TIM Output Compare idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_Idle_State */

  uint32_t OCNIdleState;       /*!< TIM Output Compare complementary idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Idle_State */

  uint32_t ICPolarity;         /*!< TIM Input Capture polarity.
                                    This parameter can be a value of @ref TIM_Input_Capture_Polarity */

  uint32_t ICSelection;        /*!< TIM Input Capture selection.
                                    This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t ICFilter;           /*!< TIM Input Capture filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_OnePulse_InitTypeDef_Adv;

/**
  * @brief  TIM PWM Configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t Pulse;              /*!< TIM Pulse value.
                                    This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */

  uint32_t OCMode;             /*!< TIM Output Compare mode.
                                    This parameter can be a value of @ref TIM_Output_Compare_and_PWM_modes */

  uint32_t OCPolarity;         /*!< TIM Output Compare polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OCNPolarity;        /*!< TIM Output Compare complementary polarity.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Polarity */

  uint32_t OCFastMode;         /*!< TIM Output Compare fast mode.
                                    This parameter can be a value of @ref TIM_Output_Fast_State */

  uint32_t OCIdleState;        /*!< TIM Output Compare idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_Idle_State */

  uint32_t OCNIdleState;       /*!< TIM Output Compare complementary idle state.
                                    This parameter can be a value of @ref TIM_Output_Compare_N_Idle_State */
} TIM_PWM_InitTypeDef_Adv;

/**
  * @brief  TIM Input Capture configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t ICPolarity;         /*!< Specifies the active edge of the input signal.
                                    This parameter can be a value of @ref TIM_Input_Capture_Polarity */

  uint32_t ICSelection;        /*!< Specifies the input.
                                    This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t ICPrescaler;        /*!< Specifies the Input Capture Prescaler.
                                    This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t ICFilter;           /*!< Specifies the input capture filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_IC_InitTypeDef_Adv2;

/**
  * @brief  TIM Encoder configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t EncoderMode;        /*!< Specifies the encoder mode.
                                    This parameter can be a value of @ref TIM_Encoder_Mode */

  uint32_t IC1Polarity;        /*!< Specifies the active edge of the input signal.
                                    This parameter can be a value of @ref TIM_Encoder_Input_Polarity */

  uint32_t IC1Selection;       /*!< Specifies the input.
                                    This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t IC1Prescaler;       /*!< Specifies the Input Capture Prescaler.
                                    This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t IC1Filter;          /*!< Specifies the input capture filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */

  uint32_t IC2Polarity;        /*!< Specifies the active edge of the input signal.
                                    This parameter can be a value of @ref TIM_Encoder_Input_Polarity */

  uint32_t IC2Selection;       /*!< Specifies the input.
                                    This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t IC2Prescaler;       /*!< Specifies the Input Capture Prescaler.
                                    This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t IC2Filter;          /*!< Specifies the input capture filter.
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_Encoder_InitTypeDef_Adv2;

/**
  * @brief  TIM Hall sensor Configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t IC1Polarity;         /*!< Specifies the active edge of the input signal.
                                     This parameter can be a value of @ref TIM_Input_Capture_Polarity */

  uint32_t IC1Prescaler;        /*!< Specifies the Input Capture Prescaler.
                                     This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t IC1Filter;           /*!< Specifies the input capture filter.
                                     This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */

  uint32_t Commutation_Delay;   /*!< Specifies the pulse value to be loaded into the Capture Compare Register.
                                     This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */
} TIM_HallSensor_InitTypeDef_Adv2;

/**
  * @brief  TIM Break input(s) and Dead time configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t OffStateRunMode;     /*!< TIM off state in run mode.
                                     This parameter can be a value of @ref TIM_OSSR_Off_State_Selection_for_Run_mode_state */

  uint32_t OffStateIDLEMode;    /*!< TIM off state in IDLE mode.
                                     This parameter can be a value of @ref TIM_OSSI_Off_State_Selection_for_Idle_mode_state */

  uint32_t LockLevel;           /*!< TIM Lock level.
                                     This parameter can be a value of @ref TIM_Lock_level */

  uint32_t DeadTime;            /*!< TIM dead Time.
                                     This parameter can be a number between Min_Data = 0x00 and Max_Data = 0xFF */

  uint32_t BreakState;          /*!< TIM Break State.
                                     This parameter can be a value of @ref TIM_Break_Input_enable_disable */

  uint32_t BreakPolarity;       /*!< TIM Break input polarity.
                                     This parameter can be a value of @ref TIM_Break_Polarity */

  uint32_t BreakFilter;         /*!< Specifies the break input filter.
                                     This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */

  uint32_t AutomaticOutput;     /*!< TIM Automatic Output Enable state.
                                     This parameter can be a value of @ref TIM_AOE_Bit_Set_Reset */
} TIM_BreakDeadTimeConfigTypeDef_Adv2;

/**
  * @brief  TIM Master configuration Structure definition for TIM1 and TIM8
  */
typedef struct
{
  uint32_t  MasterOutputTrigger;   /*!< Trigger output (TRGO) selection.
                                        This parameter can be a value of @ref TIM_Master_Mode_Selection */

  uint32_t  MasterSlaveMode;       /*!< Master/slave mode selection.
                                        This parameter can be a value of @ref TIM_Master_Slave_Mode */
} TIM_MasterConfigTypeDef_Adv2;

/**
  * @
