```c
/**
  ******************************************************************************
  * @file    stm32f1xx_hal_tim.h
  * @author  MCD Application Team
  * @brief   Header file of TIM HAL module.
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
#ifndef STM32F1xx_HAL_TIM_H
#define STM32F1xx_HAL_TIM_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include "stm32f1xx_hal_def.h"

/** @addtogroup STM32F1xx_HAL_Driver
  * @{
  */

/** @addtogroup TIM
  * @{
  */

/* Exported types ------------------------------------------------------------*/
/** @defgroup TIM_Exported_Types TIM Exported Types
  * @{
  */

/**
  * @brief  TIM Time base Configuration Structure definition
  */
typedef struct
{
  uint32_t Prescaler;         /*!< Specifies the prescaler value used to divide the TIM clock.
                                   This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */

  uint32_t CounterMode;       /*!< Specifies the counter mode.
                                   This parameter can be a value of @ref TIM_Counter_Mode */

  uint32_t Period;            /*!< Specifies the period value to be loaded into the active
                                   Auto-Reload Register at the next update event.
                                   This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF.  */

  uint32_t ClockDivision;     /*!< Specifies the clock division.
                                   This parameter can be a value of @ref TIM_Clock_Division_CKD */

  uint32_t RepetitionCounter; /*!< Specifies the repetition counter value. Each time the RCR downcounter
                                   reaches zero, an update event is generated and counting restarts
                                   from the RCR value (N).
                                   This means in PWM mode that (N+1) corresponds to:
                                      - the number of PWM periods in edge-aligned mode
                                      - the number of half PWM period in center-aligned mode
                                   This parameter must be a number between Min_Data = 0x00 and Max_Data = 0xFF.
                                   @note This parameter is valid only for TIM1 and TIM8. */

  uint32_t AutoReloadPreload; /*!< Specifies the auto-reload preload.
                                   This parameter can be a value of @ref TIM_AutoReload_Preload */
} TIM_Base_InitTypeDef;

/**
  * @brief  TIM Output Compare Configuration Structure definition
  */
typedef struct
{
  uint32_t OCMode;        /*!< Specifies the TIM mode.
                               This parameter can be a value of @ref TIM_Output_Compare_and_PWM_modes */

  uint32_t Pulse;         /*!< Specifies the pulse value to be loaded into the Capture Compare Register.
                               This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */

  uint32_t OCPolarity;    /*!< Specifies the output polarity.
                               This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OCNPolarity;   /*!< Specifies the complementary output polarity.
                               This parameter can be a value of @ref TIM_Output_Compare_N_Polarity
                               @note This parameter is valid only for TIM1 and TIM8. */

  uint32_t OCIdleState;   /*!< Specifies the TIM Output Compare pin state during Idle state.
                               This parameter can be a value of @ref TIM_Output_Compare_Idle_State
                               @note This parameter is valid only for TIM1 and TIM8. */

  uint32_t OCNIdleState;  /*!< Specifies the TIM Output Compare pin state during Idle state.
                               This parameter can be a value of @ref TIM_Output_Compare_N_Idle_State
                               @note This parameter is valid only for TIM1 and TIM8. */
} TIM_OC_InitTypeDef;

/**
  * @brief  TIM One Pulse Mode Configuration Structure definition
  */
typedef struct
{
  uint32_t OCMode;        /*!< Specifies the TIM mode.
                               This parameter can be a value of @ref TIM_Output_Compare_and_PWM_modes */

  uint32_t Pulse;         /*!< Specifies the pulse value to be loaded into the Capture Compare Register.
                               This parameter can be a number between Min_Data = 0x0000 and Max_Data = 0xFFFF */

  uint32_t OCPolarity;    /*!< Specifies the output polarity.
                               This parameter can be a value of @ref TIM_Output_Compare_Polarity */

  uint32_t OCNPolarity;   /*!< Specifies the complementary output polarity.
                               This parameter can be a value of @ref TIM_Output_Compare_N_Polarity
                               @note This parameter is valid only for TIM1 and TIM8. */

  uint32_t OCIdleState;   /*!< Specifies the TIM Output Compare pin state during Idle state.
                               This parameter can be a value of @ref TIM_Output_Compare_Idle_State
                               @note This parameter is valid only for TIM1 and TIM8. */

  uint32_t OCNIdleState;  /*!< Specifies the TIM Output Compare pin state during Idle state.
                               This parameter can be a value of @ref TIM_Output_Compare_N_Idle_State
                               @note This parameter is valid only for TIM1 and TIM8. */

  uint32_t ICPolarity;    /*!< Specifies the active edge of the input signal.
                               This parameter can be a value of @ref TIM_Input_Capture_Polarity */

  uint32_t ICSelection;   /*!< Specifies the input.
                               This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t ICFilter;      /*!< Specifies the input capture filter.
                               This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_OnePulse_InitTypeDef;

/**
  * @brief  TIM Input Capture Configuration Structure definition
  */
typedef struct
{
  uint32_t  ICPolarity;   /*!< Specifies the active edge of the input signal.
                               This parameter can be a value of @ref TIM_Input_Capture_Polarity */

  uint32_t ICSelection;   /*!< Specifies the input.
                               This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t ICPrescaler;   /*!< Specifies the Input Capture Prescaler.
                               This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t ICFilter;      /*!< Specifies the input capture filter.
                               This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_IC_InitTypeDef;

/**
  * @brief  TIM Encoder Configuration Structure definition
  */
typedef struct
{
  uint32_t EncoderMode;   /*!< Specifies the encoder mode.
                               This parameter can be a value of @ref TIM_Encoder_Mode */

  uint32_t IC1Polarity;   /*!< Specifies the active edge of the input signal.
                               This parameter can be a value of @ref TIM_Encoder_Input_Polarity */

  uint32_t IC1Selection;  /*!< Specifies the input.
                               This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t IC1Prescaler;  /*!< Specifies the Input Capture Prescaler.
                               This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t IC1Filter;     /*!< Specifies the input capture filter.
                               This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */

  uint32_t IC2Polarity;   /*!< Specifies the active edge of the input signal.
                               This parameter can be a value of @ref TIM_Encoder_Input_Polarity */

  uint32_t IC2Selection;  /*!< Specifies the input.
                               This parameter can be a value of @ref TIM_Input_Capture_Selection */

  uint32_t IC2Prescaler;  /*!< Specifies the Input Capture Prescaler.
                               This parameter can be a value of @ref TIM_Input_Capture_Prescaler */

  uint32_t IC2Filter;     /*!< Specifies the input capture filter.
                               This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_Encoder_InitTypeDef;

/**
  * @brief  Clock Configuration Handle Structure definition
  */
typedef struct
{
  uint32_t ClockSource;     /*!< TIM clock sources
                                 This parameter can be a value of @ref TIM_Clock_Source */
  uint32_t ClockPolarity;   /*!< TIM clock polarity
                                 This parameter can be a value of @ref TIM_Clock_Polarity */
  uint32_t ClockPrescaler;  /*!< TIM clock prescaler
                                 This parameter can be a value of @ref TIM_Clock_Prescaler */
  uint32_t ClockFilter;     /*!< TIM clock filter
                                 This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_ClockConfigTypeDef;

/**
  * @brief  TIM Clear Input Configuration Handle Structure definition
  */
typedef struct
{
  uint32_t ClearInputState;      /*!< TIM clear Input state
                                      This parameter can be ENABLE or DISABLE */
  uint32_t ClearInputSource;     /*!< TIM clear Input sources
                                      This parameter can be a value of @ref TIM_ClearInput_Source */
  uint32_t ClearInputPolarity;   /*!< TIM Clear Input polarity
                                      This parameter can be a value of @ref TIM_ClearInput_Polarity */
  uint32_t ClearInputPrescaler;  /*!< TIM Clear Input prescaler
                                      This parameter must be 0: When OCRef clear feature is used with ETR source,
                                      ETR prescaler must be off */
  uint32_t ClearInputFilter;     /*!< TIM Clear Input filter
                                      This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_ClearInputConfigTypeDef;

/**
  * @brief  TIM Master configuration Structure definition
  */
typedef struct
{
  uint32_t  MasterOutputTrigger;   /*!< Trigger output (TRGO) selection
                                        This parameter can be a value of @ref TIM_Master_Mode_Selection */
  uint32_t  MasterSlaveMode;       /*!< Master/slave mode selection
                                        This parameter can be a value of @ref TIM_Master_Slave_Mode */
} TIM_MasterConfigTypeDef;

/**
  * @brief  TIM Slave configuration Structure definition
  */
typedef struct
{
  uint32_t  SlaveMode;         /*!< Slave mode selection
                                    This parameter can be a value of @ref TIM_Slave_Mode */
  uint32_t  InputTrigger;      /*!< Input Trigger source
                                    This parameter can be a value of @ref TIM_Trigger_Selection */
  uint32_t  TriggerPolarity;   /*!< Input Trigger polarity
                                    This parameter can be a value of @ref TIM_Trigger_Polarity */
  uint32_t  TriggerPrescaler;  /*!< Input trigger prescaler
                                    This parameter can be a value of @ref TIM_Trigger_Prescaler */
  uint32_t  TriggerFilter;     /*!< Input trigger filter
                                    This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
} TIM_SlaveConfigTypeDef;

/**
  * @brief  TIM Break input(s) and Dead time configuration Structure definition
  * @note   2 break inputs can be configured (BKIN and BKIN2) with configurable
  *        filter and polarity.
  */
typedef struct
{
  uint32_t OffStateRunMode;      /*!< TIM off state in run mode
                                      This parameter can be a value of @ref TIM_OSSR_Off_State_Selection_for_Run_mode_state */
  uint32_t OffStateIDLEMode;     /*!< TIM off state in IDLE mode
                                      This parameter can be a value of @ref TIM_OSSI_Off_State_Selection_for_Idle_mode_state */
  uint32_t LockLevel;            /*!< TIM Lock level
                                      This parameter can be a value of @ref TIM_Lock_level */
  uint32_t DeadTime;             /*!< TIM dead Time
                                      This parameter can be a number between Min_Data = 0x00 and Max_Data = 0xFF */
  uint32_t BreakState;           /*!< TIM Break State
                                      This parameter can be a value of @ref TIM_Break_Input_enable_disable */
  uint32_t BreakPolarity;        /*!< TIM Break input polarity
                                      This parameter can be a value of @ref TIM_Break_Polarity */
  uint32_t BreakFilter;          /*!< Specifies the break input filter.
                                      This parameter can be a number between Min_Data = 0x0 and Max_Data = 0xF */
  uint32_t AutomaticOutput;      /*!< TIM Automatic Output Enable state
                                      This parameter can be a value of @ref TIM_AOE_Bit_Set_Reset */
} TIM_BreakDeadTimeConfigTypeDef;

/**
  * @brief  HAL State structures definition
  */
typedef enum
{
  HAL_TIM_STATE_RESET             = 0x00U,    /*!< Peripheral not yet initialized or disabled  */
  HAL_TIM_STATE_READY             = 0x01U,    /*!< Peripheral Initialized and ready for use    */
  HAL_TIM_STATE_BUSY              = 0x02U,    /*!< An internal process is ongoing              */
  HAL_TIM_STATE_TIMEOUT           = 0x03U,    /*!< Timeout state                               */
  HAL_TIM_STATE_ERROR             = 0x04U     /*!< Reception process is ongoing                */
} HAL_TIM_StateTypeDef;

/**
  * @brief  TIM Channel States definition
  */
typedef enum
{
  HAL_TIM_CHANNEL_STATE_RESET             = 0x00U,    /*!< TIM Channel initial state                         */
  HAL_TIM_CHANNEL_STATE_READY             = 0x01U,    /*!< TIM Channel ready for use                         */
  HAL_TIM_CHANNEL_STATE_BUSY              = 0x02U,    /*!< An internal process is ongoing on the channel     */
  HAL_TIM_CHANNEL_STATE_BUSY_ERROR        = 0x03U     /*!< An internal process is ongoing on the channel     */
} HAL_TIM_ChannelStateTypeDef;

/**
  * @brief  DMA Burst States definition
  */
typedef enum
{
  HAL_DMA_BURST_STATE_RESET             = 0x00U,    /*!< DMA Burst initial state                         */
  HAL_DMA_BURST_STATE_READY             = 0x01U,    /*!< DMA Burst ready for use                         */
  HAL_DMA_BURST_STATE_BUSY              = 0x02U     /*!< Ongoing DMA Burst                               */
} HAL_TIM_DMABurstStateTypeDef;

/**
  * @brief  HAL Active channel structures definition
  */
typedef enum
{
  HAL_TIM_ACTIVE_CHANNEL_1        = 0x01U,    /*!< The active channel is 1     */
  HAL_TIM_ACTIVE_CHANNEL_2        = 0x02U,    /*!< The active channel is 2     */
  HAL_TIM_ACTIVE_CHANNEL_3        = 0x04U,    /*!< The active channel is 3     */
  HAL_TIM_ACTIVE_CHANNEL_4        = 0x08U,    /*!< The active channel is 4     */
  HAL_TIM_ACTIVE_CHANNEL_CLEARED  = 0x00U     /*!< All active channels cleared */
} HAL_TIM_ActiveChannel;

/**
  * @brief  TIM Time Base Handle Structure definition
  */
#if (USE_HAL_TIM_REGISTER_CALLBACKS == 1)
typedef struct __TIM_HandleTypeDef
#else
typedef struct
#endif /* USE_HAL_TIM_REGISTER_CALLBACKS */
{
  TIM_TypeDef                 *Instance;     /*!< Register base address             */
  TIM_Base_InitTypeDef        Init;          /*!< TIM Time Base required parameters */
  HAL_TIM_ActiveChannel       Channel;       /*!< Active channel                    */
  DMA_HandleTypeDef           *hdma[7];      /*!< DMA Handlers array
                                                  This array is accessed by a @ref DMA_Handle_index */
  HAL_LockTypeDef             Lock;          /*!< Locking object                    */
  __IO HAL_TIM_StateTypeDef   State;         /*!< TIM operation state               */
  __IO HAL_TIM_ChannelStateTypeDef ChannelState[4]; /*!< TIM channel operation state */
  __IO HAL_TIM_ChannelStateTypeDef ChannelNState[4]; /*!< TIM complementary channel operation state */
  __IO HAL_TIM_DMABurstStateTypeDef DMABurstState; /*!< DMA burst operation state */

#if (USE_HAL_TIM_REGISTER_CALLBACKS == 1)
  void (* Base_MspInitCallback)(struct __TIM_HandleTypeDef *htim);              /*!< TIM Base Msp Init Callback                              */
  void (* Base_MspDeInitCallback)(struct __TIM_HandleTypeDef *htim);            /*!< TIM Base Msp DeInit Callback                            */
  void (* IC_MspInitCallback)(struct __TIM_HandleTypeDef *htim);                /*!< TIM IC Msp Init Callback                                */
  void (* IC_MspDeInitCallback)(struct __TIM_HandleTypeDef *htim);              /*!< TIM IC Msp DeInit Callback                              */
  void (* OC_MspInitCallback)(struct __TIM_HandleTypeDef *htim);                /*!< TIM OC Msp Init Callback                                */
  void (* OC_MspDeInitCallback)(struct __TIM_HandleTypeDef *htim);              /*!< TIM OC Msp DeInit Callback                              */
  void (* PWM_MspInitCallback)(struct __TIM_HandleTypeDef *htim);               /*!< TIM PWM Msp Init Callback                               */
  void (* PWM_MspDeInitCallback)(struct __TIM_HandleTypeDef *htim);             /*!< TIM PWM Msp DeInit Callback                             */
  void (* OnePulse_MspInitCallback)(struct __TIM_HandleTypeDef *htim);          /*!< TIM One Pulse Msp Init Callback                         */
  void (* OnePulse_MspDeInitCallback)(struct __TIM_HandleTypeDef *htim);        /*!< TIM One Pulse Msp DeInit Callback                       */
  void (* Encoder_MspInitCallback)(struct __TIM_HandleTypeDef *htim);           /*!< TIM Encoder Msp Init Callback                           */
  void (* Encoder_MspDeInitCallback)(struct __TIM_HandleTypeDef *htim);         /*!< TIM Encoder Msp DeInit Callback                         */
  void (* HallSensor_MspInitCallback)(struct __TIM_HandleTypeDef *htim);        /*!< TIM Hall Sensor Msp Init Callback                       */
  void (* HallSensor_MspDeInitCallback)(struct __TIM_HandleTypeDef *htim);      /*!< TIM Hall Sensor Msp DeInit Callback                     */
  void (* PeriodElapsedCallback)(struct __TIM_HandleTypeDef *htim);             /*!< TIM Period Elapsed Callback                             */
  void (* PeriodElapsedHalfCpltCallback)(struct __TIM_HandleTypeDef *htim);     /*!< TIM Period Elapsed half complete Callback               */
  void (* TriggerCallback)(struct __TIM_HandleTypeDef *htim);                   /*!< TIM Trigger Callback                                    */
  void (* TriggerHalfCpltCallback)(struct __TIM_HandleTypeDef *htim);           /*!< TIM Trigger half complete Callback                      */
  void (* IC_CaptureCallback)(struct __TIM_HandleTypeDef *htim);                /*!< TIM Input Capture Callback                              */
  void (* IC_CaptureHalfCpltCallback)(struct __TIM_HandleTypeDef *htim);        /*!< TIM Input Capture half complete Callback                */
  void (* OC_DelayElapsedCallback)(struct __TIM_HandleTypeDef *htim);           /*!< TIM Output Compare Delay Elapsed Callback               */
  void (* PWM_PulseFinishedCallback)(struct __TIM_HandleTypeDef *htim);         /*!< TIM PWM Pulse Finished Callback                         */
  void (* PWM_PulseFinishedHalfCpltCallback)(struct __TIM_HandleTypeDef *htim); /*!< TIM PWM Pulse Finished half complete Callback           */
  void (* ErrorCallback)(struct __TIM_HandleTypeDef *htim);                     /*!< TIM Error Callback                                      */
  void (* CommutationCallback)(struct __TIM_HandleTypeDef *htim);               /*!< TIM Commutation Callback                                */
  void (* CommutationHalfCpltCallback)(struct __TIM_HandleTypeDef *htim);       /*!< TIM Commutation half complete Callback                  */
  void (* BreakCallback)(struct __TIM_HandleTypeDef *htim);                     /*!< TIM Break Callback                                      */
#endif /* USE_HAL_TIM_REGISTER_CALLBACKS */
} TIM_HandleTypeDef;

/**
  * @}
  */

/* Exported constants --------------------------------------------------------*/
/** @defgroup TIM_Exported_Constants TIM Exported Constants
  * @{
  */

/** @defgroup TIM_Counter_Mode TIM Counter Mode
  * @{
  */
#define TIM_COUNTERMODE_UP                 0x00000000U                          /*!< Counter used as up-counter   */
#define TIM_COUNTERMODE_DOWN               TIM_CR1_DIR                          /*!< Counter used as down-counter */
#define TIM_COUNTERMODE_CENTERALIGNED1     TIM_CR1_CMS_0                        /*!< Center-aligned mode 1        */
#define TIM_COUNTERMODE_CENTERALIGNED2     TIM_CR1_CMS_1                        /*!< Center-aligned mode 2        */
#define TIM_COUNTERMODE_CENTERALIGNED3     TIM_CR1_CMS                          /*!< Center-aligned mode 3        */
/**
  * @}
  */

/** @defgroup TIM_Clock_Division_CKD TIM Clock Division CKD
  * @{
  */
#define TIM_CLOCKDIVISION_DIV1             0x00000000U                          /*!< Clock division: tDTS=tCK_INT   */
#define TIM_CLOCKDIVISION_DIV2             TIM_CR1_CKD_0                        /*!< Clock division: tDTS=2*tCK_INT */
#define TIM_CLOCKDIVISION_DIV4             TIM_CR1_CKD_1                        /*!< Clock division: tDTS=4*tCK_INT */
/**
  * @}
  */

/** @defgroup TIM_AutoReload_Preload TIM Auto Reload Preload
  * @{
  */
#define TIM_AUTORELOAD_PRELOAD_DISABLE     0x00000000U                          /*!< TIMx_ARR register is not buffered */
#define TIM_AUTORELOAD_PRELOAD_ENABLE      TIM_CR1_ARPE                         /*!< TIMx_ARR register is buffered     */
/**
  * @}
  */

/** @defgroup TIM_Output_Compare_and_PWM_modes TIM Output Compare and PWM modes
  * @{
  */
#define TIM_OCMODE_TIMING                  0x00000000U                          /*!< Frozen                                 */
#define TIM_OCMODE_ACTIVE                  TIM_CCMR1_OC1M_0                     /*!< Set channel to active level on match   */
#define TIM_OCMODE_INACTIVE                TIM_CCMR1_OC1M_1                     /*!< Set channel to inactive level on match */
#define TIM_OCMODE_TOGGLE                  (TIM_CCMR1_OC1M_1 | TIM_CCMR1_OC1M_0) /*!< Toggle                                 */
#define TIM_OCMODE_PWM1                    (TIM_CCMR1_OC1M_2 | TIM_CCMR1_OC1M_1) /*!< PWM mode 1                             */
#define TIM_OCMODE_PWM2                    (TIM_CCMR1_OC1M_2 | TIM_CCMR1_OC1M_1 | TIM_CCMR1_OC1M_0) /*!< PWM mode 2 */
#define TIM_OCMODE_FORCED_ACTIVE           (TIM_CCMR1_OC1M_2 | TIM_CCMR1_OC1M_0) /*!< Force active level                     */
#define TIM_OCMODE_FORCED_INACTIVE         TIM_CCMR1_OC1M_2                     /*!< Force inactive level                   */
/**
  * @}
  */

/** @defgroup TIM_Output_Compare_Polarity TIM Output Compare Polarity
  * @{
  */
#define TIM_OCPOLARITY_HIGH                0x00000000U                          /*!< Active high output */
#define TIM_OCPOLARITY_LOW                 TIM_CCER_CC1P                        /*!< Active low output  */
/**
  * @}
  */

/** @defgroup TIM_Output_Compare_N_Polarity TIM Complementary Output Compare Polarity
  * @{
  */
#define TIM_OCNPOLARITY_HIGH               0x00000000U                          /*!< Active high output */
#define TIM_OCNPOLARITY_LOW                TIM_CCER_CC1NP                       /*!< Active low output  */
/**
  * @}
  */

/** @defgroup TIM_Output_Compare_Idle_State TIM Output Compare Idle State
  * @{
  */
#define TIM_OCIDLESTATE_SET                TIM_CR2_OIS1                         /*!< Output Idle state: OCx=1 when MOE=0 */
#define TIM_OCIDLESTATE_RESET              0x00000000U                          /*!< Output Idle state: OCx=0 when MOE=0 */
/**
  * @}
  */

/** @defgroup TIM_Output_Compare_N_Idle_State TIM Complementary Output Compare Idle State
  * @{
  */
#define TIM_OCNIDLESTATE_SET               TIM_CR2_OIS1N                        /*!< Complementary output Idle state: OCxN=1 when MOE=0 */
#define TIM_OCNIDLESTATE_RESET             0x00000000U                          /*!< Complementary output Idle state: OCxN=0 when MOE=0 */
/**
  * @}
  */

/** @defgroup TIM_Input_Capture_Polarity TIM Input Capture Polarity
  * @{
  */
#define TIM_ICPOLARITY_RISING              TIM_INPUTCHANNELPOLARITY_RISING      /*!< Capture triggered by rising edge on timer input */
#define TIM_ICPOLARITY_FALLING             TIM_INPUTCHANNELPOLARITY_FALLING     /*!< Capture triggered by falling edge on timer input */
#define TIM_ICPOLARITY_BOTHEDGE            TIM_INPUTCHANNELPOLARITY_BOTHEDGE    /*!< Capture triggered by both rising and falling edges on timer input */
/**
  * @}
  */

/** @defgroup TIM_Encoder_Input_Polarity TIM Encoder Input Polarity
  * @{
  */
#define TIM_ENCODERINPUTPOLARITY_RISING    TIM_INPUTCHANNELPOLARITY_RISING      /*!< Encoder input with rising edge polarity */
#define TIM_ENCODERINPUTPOLARITY_FALLING   TIM_INPUTCHANNELPOLARITY_FALLING     /*!< Encoder input with falling edge polarity */
/**
  * @}
  */

/** @defgroup TIM_Input_Capture_Selection TIM Input Capture Selection
  * @{
  */
#define TIM_ICSELECTION_DIRECTTI           TIM_CCMR1_CC1S_0                     /*!< TIM Input 1, 2, 3 or 4 is selected to be connected to IC1, IC2, IC3 or IC4, respectively */
#define TIM_ICSELECTION_INDIRECTTI         TIM_CCMR1_CC1S_1                     /*!< TIM Input 1, 2, 3 or 4 is selected to be connected to IC2, IC1, IC4 or IC3, respectively */
#define TIM_ICSELECTION_TRC                TIM_CCMR1_CC1S                       /*!< TIM Input 1, 2, 3 or 4 is selected to be connected to TRC */
/**
  * @}
  */

/** @defgroup TIM_Input_Capture_Prescaler TIM Input Capture Prescaler
  * @{
  */
#define TIM_ICPSC_DIV1                     0x00000000U                          /*!< Capture performed each time an edge is detected on the capture input */
#define TIM_ICPSC_DIV2                     TIM_CCMR1_IC1PSC_0                   /*!< Capture performed once every 2 events                                */
#define TIM_ICPSC_DIV4                     TIM_CCMR1_IC1PSC_1                   /*!< Capture performed once every 4 events                                */
#define TIM_ICPSC_DIV8                     TIM_CCMR1_IC1PSC                     /*!< Capture performed once every 8 events                                */
/**
  * @}
  */

/** @defgroup TIM_One_Pulse_Mode TIM One Pulse Mode
  * @{
  */
#define TIM_OPMODE_SINGLE                  TIM_CR1_OPM                          /*!< Counter stops counting at the next update event */
#define TIM_OPMODE_REPETITIVE              0x00000000U                          /*!< Counter is not stopped at update event          */
/**
  * @}
  */

/** @defgroup TIM_Encoder_Mode TIM Encoder Mode
  * @{
  */
#define TIM_ENCODERMODE_TI1                TIM_SMCR_SMS_0                       /*!< Quadrature encoder mode 1, x2 mode, counts up/down on TI1FP1 edge depending on TI2FP2 level  */
#define TIM_ENCODERMODE_TI2                TIM_SMCR_SMS_1                       /*!< Quadrature encoder mode 2, x2 mode, counts up/down on TI2FP2 edge depending on TI1FP1 level. */
#define TIM_ENCODERMODE_TI12               (TIM_SMCR_SMS_1 | TIM_SMCR_SMS_0)    /*!< Quadrature encoder mode 3, x4 mode, counts up/down on both TI1FP1 and TI2FP2 edges depending on the level of the other input. */
/**
  * @}
  */

/** @defgroup TIM_Interrupt_definition TIM Interrupt Definition
  * @{
  */
#define TIM_IT_UPDATE                      TIM_DIER_UIE                         /*!< TIM update interrupt                          */
#define TIM_IT_CC1                         TIM_DIER_CC1IE                       /*!< TIM Capture/Compare 1 interrupt               */
#define TIM_IT_CC2                         TIM_DIER_CC2IE                       /*!< TIM Capture/Compare 2 interrupt               */
#define TIM_IT_CC3                         TIM_DIER_CC3IE                       /*!< TIM Capture/Compare 3 interrupt               */
#define TIM_IT_CC4                         TIM_DIER_CC4IE                       /*!< TIM Capture/Compare 4 interrupt               */
#define TIM_IT_COM                         TIM_DIER_COMIE                       /*!< TIM Commutation interrupt                     */
#define TIM_IT_TRIGGER                     TIM_DIER_TIE                         /*!< TIM Trigger interrupt                         */
#define TIM_IT_BREAK                       TIM_DIER_BIE                         /*!< TIM Break interrupt                           */
/**
  * @}
  */

/** @defgroup TIM_Commutation_Source TIM Commutation Source
  * @{
  */
#define TIM_COMMUTATION_TRGI               TIM_CR2_CCUS                         /*!< When CCUS bit is set in TIMx_CR2 register, COMG bit must be set to generate a commutation event */
#define TIM_COMMUTATION_SOFTWARE           0x00000000U                          /*!< When CCUS bit is reset in TIMx_CR2 register, COMG bit must be set to generate a commutation event */
/**
  * @}
  */

/** @defgroup TIM_DMA_sources TIM DMA Sources
  * @{
  */
#define TIM_DMA_UPDATE                     TIM_DIER_UDE                         /*!< DMA request is triggered by the update event          */
#define TIM_DMA_CC1                        TIM_DIER_CC1DE                       /*!< DMA request is triggered by the capture/compare macth 1 event */
#define TIM_DMA_CC2                        TIM_DIER_CC2DE                       /*!< DMA request is triggered by the capture/compare macth 2 event event */
#define TIM_DMA_CC3                        TIM_DIER_CC3DE                       /*!< DMA request is triggered by the capture/compare macth 3 event event */
#define TIM_DMA_CC4                        TIM_DIER_CC4DE                       /*!< DMA request is triggered by the capture/compare macth 4 event event */
#define TIM_DMA_COM                        TIM_DIER_COMDE                       /*!< DMA request is triggered by the commutation event      */
#define TIM_DMA_TRIGGER                    TIM_DIER_TDE                         /*!< DMA request is triggered by the trigger event          */
/**
  * @}
  */

/** @defgroup TIM_Event_Source TIM Event Source
  * @{
  */
#define TIM_EVENTSOURCE_UPDATE             TIM_EGR_UG                           /*!< Reinitialize the counter and generates an update of the registers */
#define TIM_EVENTSOURCE_CC1                TIM_EGR_CC1G                         /*!< A capture/compare event is generated on channel 1                */
#define TIM_EVENTSOURCE_CC2                TIM_EGR_CC2G                         /*!< A capture/compare event is generated on channel 2                */
#define TIM_EVENTSOURCE_CC3                TIM_EGR_CC3G                         /*!< A capture/compare event is generated on channel 3                */
#define TIM_EVENTSOURCE_CC4                TIM_EGR_CC4G                         /*!< A capture/compare event is generated on channel 4                */
#define TIM_EVENTSOURCE_COM                TIM_EGR_COMG                         /*!< A commutation event is generated                                 */
#define TIM_EVENTSOURCE_TRIGGER            TIM_EGR_TG                           /*!< A trigger event is generated                                     */
#define TIM_EVENTSOURCE_BREAK              TIM_EGR_BG                           /*!< A break event is generated                                       */
/**
  * @}
  */

/** @defgroup TIM_Flag_definition TIM Flag Definition
  * @{
  */
#define TIM_FLAG_UPDATE                    TIM_SR_UIF                           /*!< TIM update Flag                                  */
#define TIM_FLAG_CC1                       TIM_SR_CC1IF                         /*!< TIM Capture/Compare 1 Flag                       */
#define TIM_FLAG_CC2                       TIM_SR_CC2IF                         /*!< TIM Capture/Compare 2 Flag                       */
#define TIM_FLAG_CC3                       TIM_SR_CC3IF                         /*!< TIM Capture/Compare 3 Flag                       */
#define TIM_FLAG_CC4                       TIM_SR_
