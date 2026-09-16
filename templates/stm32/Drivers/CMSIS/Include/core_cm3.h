```c
/* core_cm3.h - CMSIS Cortex-M3 Core Peripheral Access Layer Header File
 * Minimal production-grade subset for STM32F103C8T6 (ARM Cortex-M3 r2p1)
 * Compatible with CMSIS-Core v4/v5 conventions.
 */

#ifndef __CORE_CM3_H_GENERIC
#define __CORE_CM3_H_GENERIC

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

/* ==========================================================================
 * Configuration: CMSIS compiler abstraction
 * ========================================================================== */
#include "cmsis_compiler.h"

/* ==========================================================================
 * Cortex-M3 core version
 * ========================================================================== */
#define __CM3_CMSIS_VERSION_MAIN  (0x04U)
#define __CM3_CMSIS_VERSION_SUB   (0x30U)
#define __CM3_CMSIS_VERSION       ((__CM3_CMSIS_VERSION_MAIN << 16U) | \
                                    __CM3_CMSIS_VERSION_SUB)

#define __CORTEX_M                (0x03U)

/* ==========================================================================
 * Compiler specific definitions
 * ========================================================================== */
#ifndef __ASM
  #define __ASM                  __ASM
#endif
#ifndef __INLINE
  #define __INLINE               inline
#endif
#ifndef __STATIC_INLINE
  #define __STATIC_INLINE        static inline
#endif
#ifndef __STATIC_FORCEINLINE
  #define __STATIC_FORCEINLINE   __STATIC_INLINE
#endif
#ifndef __NO_RETURN
  #define __NO_RETURN            __attribute__((__noreturn__))
#endif
#ifndef __USED
  #define __USED                 __attribute__((used))
#endif
#ifndef __WEAK
  #define __WEAK                 __attribute__((weak))
#endif
#ifndef __PACKED
  #define __PACKED               __attribute__((packed, aligned(1)))
#endif
#ifndef __PACKED_STRUCT
  #define __PACKED_STRUCT        struct __attribute__((packed, aligned(1)))
#endif
#ifndef __PACKED_UNION
  #define __PACKED_UNION         union __attribute__((packed, aligned(1)))
#endif
#ifndef __UNALIGNED_UINT32
  #define __UNALIGNED_UINT32(x)  (*((__packed uint32_t *)(x)))
#endif
#ifndef __ALIGNED
  #define __ALIGNED(x)           __attribute__((aligned(x)))
#endif
#ifndef __RESTRICT
  #define __RESTRICT             __restrict
#endif

/* ==========================================================================
 * Interrupt Number Definition
 * ========================================================================== */
typedef enum IRQn
{
  /* Cortex-M3 Processor Exceptions Numbers */
  NonMaskableInt_IRQn         = -14,
  HardFault_IRQn              = -13,
  MemoryManagement_IRQn       = -12,
  BusFault_IRQn               = -11,
  UsageFault_IRQn             = -10,
  SVCall_IRQn                 =  -5,
  DebugMonitor_IRQn           =  -4,
  PendSV_IRQn                 =  -2,
  SysTick_IRQn                =  -1,

  /* STM32F103x8/xB specific Interrupt Numbers */
  WWDG_IRQn                   =   0,
  PVD_IRQn                    =   1,
  TAMPER_IRQn                 =   2,
  RTC_IRQn                    =   3,
  FLASH_IRQn                  =   4,
  RCC_IRQn                    =   5,
  EXTI0_IRQn                  =   6,
  EXTI1_IRQn                  =   7,
  EXTI2_IRQn                  =   8,
  EXTI3_IRQn                  =   9,
  EXTI4_IRQn                  =  10,
  DMA1_Channel1_IRQn          =  11,
  DMA1_Channel2_IRQn          =  12,
  DMA1_Channel3_IRQn          =  13,
  DMA1_Channel4_IRQn          =  14,
  DMA1_Channel5_IRQn          =  15,
  DMA1_Channel6_IRQn          =  16,
  DMA1_Channel7_IRQn          =  17,
  ADC1_2_IRQn                 =  18,
  USB_HP_CAN1_TX_IRQn         =  19,
  USB_LP_CAN1_RX0_IRQn        =  20,
  CAN1_RX1_IRQn               =  21,
  CAN1_SCE_IRQn               =  22,
  EXTI9_5_IRQn                =  23,
  TIM1_BRK_IRQn               =  24,
  TIM1_UP_IRQn                =  25,
  TIM1_TRG_COM_IRQn           =  26,
  TIM1_CC_IRQn                =  27,
  TIM2_IRQn                   =  28,
  TIM3_IRQn                   =  29,
  TIM4_IRQn                   =  30,
  I2C1_EV_IRQn                =  31,
  I2C1_ER_IRQn                =  32,
  I2C2_EV_IRQn                =  33,
  I2C2_ER_IRQn                =  34,
  SPI1_IRQn                   =  35,
  SPI2_IRQn                   =  36,
  USART1_IRQn                 =  37,
  USART2_IRQn                 =  38,
  USART3_IRQn                 =  39,
  EXTI15_10_IRQn              =  40,
  RTCAlarm_IRQn               =  41,
  USBWakeUp_IRQn              =  42,
  TIM8_BRK_IRQn               =  43,
  TIM8_UP_IRQn                =  44,
  TIM8_TRG_COM_IRQn           =  45,
  TIM8_CC_IRQn                =  46,
  ADC3_IRQn                   =  47,
  FSMC_IRQn                   =  48,
  SDIO_IRQn                   =  49,
  TIM5_IRQn                   =  50,
  SPI3_IRQn                   =  51,
  UART4_IRQn                  =  52,
  UART5_IRQn                  =  53,
  TIM6_IRQn                   =  54,
  TIM7_IRQn                   =  55,
  DMA2_Channel1_IRQn          =  56,
  DMA2_Channel2_IRQn          =  57,
  DMA2_Channel3_IRQn          =  58,
  DMA2_Channel4_5_IRQn        =  59
} IRQn_Type;

/* ==========================================================================
 * Core Configuration
 * ========================================================================== */
#define __CM3_REV                 0x0201U
#define __MPU_PRESENT             0U
#define __NVIC_PRIO_BITS          4U
#define __Vendor_SysTickConfig    0U
#define __FPU_PRESENT             0U

/* ==========================================================================
 * Core Register Access
 * ========================================================================== */
typedef struct
{
  __IOM uint32_t ISER[8U];
        uint32_t RESERVED0[24U];
  __IOM uint32_t ICER[8U];
        uint32_t RESERVED1[24U];
  __IOM uint32_t ISPR[8U];
        uint32_t RESERVED2[24U];
  __IOM uint32_t ICPR[8U];
        uint32_t RESERVED3[24U];
  __IOM uint32_t IABR[8U];
        uint32_t RESERVED4[56U];
  __IOM uint8_t  IP[240U];
        uint32_t RESERVED5[644U];
  __OM  uint32_t STIR;
}  NVIC_Type;

typedef struct
{
  __IM  uint32_t CPUID;
  __IOM uint32_t ICSR;
  __IOM uint32_t VTOR;
  __IOM uint32_t AIRCR;
  __IOM uint32_t SCR;
  __IOM uint32_t CCR;
  __IOM uint8_t  SHP[12U];
  __IOM uint32_t SHCSR;
  __IOM uint32_t CFSR;
  __IOM uint32_t HFSR;
  __IOM uint32_t DFSR;
  __IOM uint32_t MMFAR;
  __IOM uint32_t BFAR;
  __IOM uint32_t AFSR;
  __IM  uint32_t PFR[2U];
  __IM  uint32_t DFR;
  __IM  uint32_t ADR;
  __IM  uint32_t MMFR[4U];
  __IM  uint32_t ISAR[5U];
        uint32_t RESERVED0[5U];
  __IOM uint32_t CPACR;
} SCB_Type;

typedef struct
{
        uint32_t RESERVED0[1U];
  __IOM uint32_t ICTR;
  __IOM uint32_t ACTLR;
} SCnSCB_Type;

typedef struct
{
  __IOM uint32_t CTRL;
  __IOM uint32_t LOAD;
  __IOM uint32_t VAL;
  __IM  uint32_t CALIB;
} SysTick_Type;

typedef struct
{
  __IOM uint32_t CTRL;
  __IOM uint32_t CYCCNT;
  __IOM uint32_t CPICNT;
  __IOM uint32_t EXCCNT;
  __IOM uint32_t SLEEPCNT;
  __IOM uint32_t LSUCNT;
  __IOM uint32_t FOLDCNT;
  __IM  uint32_t PCSR;
  __IOM uint32_t COMP0;
  __IOM uint32_t MASK0;
  __IOM uint32_t FUNCTION0;
        uint32_t RESERVED0[1U];
  __IOM uint32_t COMP1;
  __IOM uint32_t MASK1;
  __IOM uint32_t FUNCTION1;
        uint32_t RESERVED1[1U];
  __IOM uint32_t COMP2;
  __IOM uint32_t MASK2;
  __IOM uint32_t FUNCTION2;
        uint32_t RESERVED2[1U];
  __IOM uint32_t COMP3;
  __IOM uint32_t MASK3;
  __IOM uint32_t FUNCTION3;
} DWT_Type;

typedef struct
{
  __IOM uint32_t DHCSR;
  __IM  uint32_t DCRSR;
  __IOM uint32_t DCRDR;
  __IOM uint32_t DEMCR;
} CoreDebug_Type;

/* ==========================================================================
 * Base Addresses
 * ========================================================================== */
#define SCS_BASE            (0xE000E000UL)
#define ITM_BASE            (0xE0000000UL)
#define DWT_BASE            (0xE0001000UL)
#define TPI_BASE            (0xE0040000UL)
#define CoreDebug_BASE      (0xE000EDF0UL)
#define SysTick_BASE        (SCS_BASE +  0x0010UL)
#define NVIC_BASE           (SCS_BASE +  0x0100UL)
#define SCB_BASE            (SCS_BASE +  0x0D00UL)

#define SCnSCB              ((SCnSCB_Type    *)     SCS_BASE      )
#define SCB                 ((SCB_Type       *)     SCB_BASE      )
#define SysTick             ((SysTick_Type   *)     SysTick_BASE  )
#define NVIC                ((NVIC_Type      *)     NVIC_BASE     )
#define DWT                 ((DWT_Type       *)     DWT_BASE      )
#define CoreDebug           ((CoreDebug_Type *)     CoreDebug_BASE)

/* ==========================================================================
 * SCB Register Bit Definitions
 * ========================================================================== */
#define SCB_CPUID_IMPLEMENTER_Pos          24U
#define SCB_CPUID_IMPLEMENTER_Msk          (0xFFUL << SCB_CPUID_IMPLEMENTER_Pos)
#define SCB_CPUID_VARIANT_Pos              20U
#define SCB_CPUID_VARIANT_Msk              (0xFUL << SCB_CPUID_VARIANT_Pos)
#define SCB_CPUID_ARCHITECTURE_Pos         16U
#define SCB_CPUID_ARCHITECTURE_Msk         (0xFUL << SCB_CPUID_ARCHITECTURE_Pos)
#define SCB_CPUID_PARTNO_Pos                4U
#define SCB_CPUID_PARTNO_Msk               (0xFFFUL << SCB_CPUID_PARTNO_Pos)
#define SCB_CPUID_REVISION_Pos              0U
#define SCB_CPUID_REVISION_Msk             (0xFUL << SCB_CPUID_REVISION_Pos)

#define SCB_ICSR_NMIPENDSET_Pos            31U
#define SCB_ICSR_NMIPENDSET_Msk            (1UL << SCB_ICSR_NMIPENDSET_Pos)
#define SCB_ICSR_PENDSVSET_Pos             28U
#define SCB_ICSR_PENDSVSET_Msk             (1UL << SCB_ICSR_PENDSVSET_Pos)
#define SCB_ICSR_PENDSVCLR_Pos             27U
#define SCB_ICSR_PENDSVCLR_Msk             (1UL << SCB_ICSR_PENDSVCLR_Pos)
#define SCB_ICSR_PENDSTSET_Pos             26U
#define SCB_ICSR_PENDSTSET_Msk             (1UL << SCB_ICSR_PENDSTSET_Pos)
#define SCB_ICSR_PENDSTCLR_Pos             25U
#define SCB_ICSR_PENDSTCLR_Msk             (1UL << SCB_ICSR_PENDSTCLR_Pos)
#define SCB_ICSR_ISRPREEMPT_Pos            23U
#define SCB_ICSR_ISRPREEMPT_Msk            (1UL << SCB_ICSR_ISRPREEMPT_Pos)
#define SCB_ICSR_ISRPENDING_Pos            22U
#define SCB_ICSR_ISRPENDING_Msk            (1UL << SCB_ICSR_ISRPENDING_Pos)
#define SCB_ICSR_VECTPENDING_Pos           12U
#define SCB_ICSR_VECTPENDING_Msk           (0x1FFUL << SCB_ICSR_VECTPENDING_Pos)
#define SCB_ICSR_RETTOBASE_Pos             11U
#define SCB_ICSR_RETTOBASE_Msk             (1UL << SCB_ICSR_RETTOBASE_Pos)
#define SCB_ICSR_VECTACTIVE_Pos             0U
#define SCB_ICSR_VECTACTIVE_Msk            (0x1FFUL << SCB_ICSR_VECTACTIVE_Pos)

#define SCB_VTOR_TBLOFF_Pos                 7U
#define SCB_VTOR_TBLOFF_Msk                (0x1FFFFFFUL << SCB_VTOR_TBLOFF_Pos)

#define SCB_AIRCR_VECTKEY_Pos              16U
#define SCB_AIRCR_VECTKEY_Msk              (0xFFFFUL << SCB_AIRCR_VECTKEY_Pos)
#define SCB_AIRCR_VECTKEYSTAT_Pos          16U
#define SCB_AIRCR_VECTKEYSTAT_Msk          (0xFFFFUL << SCB_AIRCR_VECTKEYSTAT_Pos)
#define SCB_AIRCR_ENDIANESS_Pos            15U
#define SCB_AIRCR_ENDIANESS_Msk            (1UL << SCB_AIRCR_ENDIANESS_Pos)
#define SCB_AIRCR_PRIGROUP_Pos              8U
#define SCB_AIRCR_PRIGROUP_Msk             (7UL << SCB_AIRCR_PRIGROUP_Pos)
#define SCB_AIRCR_SYSRESETREQ_Pos           2U
#define SCB_AIRCR_SYSRESETREQ_Msk          (1UL << SCB_AIRCR_SYSRESETREQ_Pos)
#define SCB_AIRCR_VECTCLRACTIVE_Pos         1U
#define SCB_AIRCR_VECTCLRACTIVE_Msk        (1UL << SCB_AIRCR_VECTCLRACTIVE_Pos)
#define SCB_AIRCR_VECTRESET_Pos             0U
#define SCB_AIRCR_VECTRESET_Msk            (1UL << SCB_AIRCR_VECTRESET_Pos)

#define SCB_SCR_SEVONPEND_Pos               4U
#define SCB_SCR_SEVONPEND_Msk              (1UL << SCB_SCR_SEVONPEND_Pos)
#define SCB_SCR_SLEEPDEEP_Pos               2U
#define SCB_SCR_SLEEPDEEP_Msk              (1UL << SCB_SCR_SLEEPDEEP_Pos)
#define SCB_SCR_SLEEPONEXIT_Pos             1U
#define SCB_SCR_SLEEPONEXIT_Msk            (1UL << SCB_SCR_SLEEPONEXIT_Pos)

#define SCB_CCR_STKALIGN_Pos                9U
#define SCB_CCR_STKALIGN_Msk               (1UL << SCB_CCR_STKALIGN_Pos)
#define SCB_CCR_BFHFNMIGN_Pos               8U
#define SCB_CCR_BFHFNMIGN_Msk              (1UL << SCB_CCR_BFHFNMIGN_Pos)
#define SCB_CCR_DIV_0_TRP_Pos               4U
#define SCB_CCR_DIV_0_TRP_Msk              (1UL << SCB_CCR_DIV_0_TRP_Pos)
#define SCB_CCR_UNALIGN_TRP_Pos             3U
#define SCB_CCR_UNALIGN_TRP_Msk            (1UL << SCB_CCR_UNALIGN_TRP_Pos)
#define SCB_CCR_USERSETMPEND_Pos            1U
#define SCB_CCR_USERSETMPEND_Msk           (1UL << SCB_CCR_USERSETMPEND_Pos)
#define SCB_CCR_NONBASETHRDENA_Pos          0U
#define SCB_CCR_NONBASETHRDENA_Msk         (1UL << SCB_CCR_NONBASETHRDENA_Pos)

#define SCB_SHCSR_USGFAULTENA_Pos          18U
#define SCB_SHCSR_USGFAULTENA_Msk          (1UL << SCB_SHCSR_USGFAULTENA_Pos)
#define SCB_SHCSR_BUSFAULTENA_Pos          17U
#define SCB_SHCSR_BUSFAULTENA_Msk          (1UL << SCB_SHCSR_BUSFAULTENA_Pos)
#define SCB_SHCSR_MEMFAULTENA_Pos          16U
#define SCB_SHCSR_MEMFAULTENA_Msk          (1UL << SCB_SHCSR_MEMFAULTENA_Pos)
#define SCB_SHCSR_SVCALLPENDED_Pos         15U
#define SCB_SHCSR_SVCALLPENDED_Msk         (1UL << SCB_SHCSR_SVCALLPENDED_Pos)
#define SCB_SHCSR_BUSFAULTPENDED_Pos       14U
#define SCB_SHCSR_BUSFAULTPENDED_Msk       (1UL << SCB_SHCSR_BUSFAULTPENDED_Pos)
#define SCB_SHCSR_MEMFAULTPENDED_Pos       13U
#define SCB_SHCSR_MEMFAULTPENDED_Msk       (1UL << SCB_SHCSR_MEMFAULTPENDED_Pos)
#define SCB_SHCSR_USGFAULTPENDED_Pos       12U
#define SCB_SHCSR_USGFAULTPENDED_Msk       (1UL << SCB_SHCSR_USGFAULTPENDED_Pos)
#define SCB_SHCSR_SYSTICKACT_Pos           11U
#define SCB_SHCSR_SYSTICKACT_Msk           (1UL << SCB_SHCSR_SYSTICKACT_Pos)
#define SCB_SHCSR_PENDSVACT_Pos            10U
#define SCB_SHCSR_PENDSVACT_Msk            (1UL << SCB_SHCSR_PENDSVACT_Pos)
#define SCB_SHCSR_MONITORACT_Pos            8U
#define SCB_SHCSR_MONITORACT_Msk           (1UL << SCB_SHCSR_MONITORACT_Pos)
#define SCB_SHCSR_SVCALLACT_Pos             7U
#define SCB_SHCSR_SVCALLACT_Msk            (1UL << SCB_SHCSR_SVCALLACT_Pos)
#define SCB_SHCSR_USGFAULTACT_Pos           3U
#define SCB_SHCSR_USGFAULTACT_Msk          (1UL << SCB_SHCSR_USGFAULTACT_Pos)
#define SCB_SHCSR_BUSFAULTACT_Pos           1U
#define SCB_SHCSR_BUSFAULTACT_Msk          (1UL << SCB_SHCSR_BUSFAULTACT_Pos)
#define SCB_SHCSR_MEMFAULTACT_Pos           0U
#define SCB_SHCSR_MEMFAULTACT_Msk          (1UL << SCB_SHCSR_MEMFAULTACT_Pos)

#define SCB_CFSR_USGFAULTSR_Pos            16U
#define SCB_CFSR_USGFAULTSR_Msk            (0xFFFFUL << SCB_CFSR_USGFAULTSR_Pos)
#define SCB_CFSR_BUSFAULTSR_Pos             8U
#define SCB_CFSR_BUSFAULTSR_Msk            (0xFFUL << SCB_CFSR_BUSFAULTSR_Pos)
#define SCB_CFSR_MEMFAULTSR_Pos             0U
#define SCB_CFSR_MEMFAULTSR_Msk            (0xFFUL << SCB_CFSR_MEMFAULTSR_Pos)

#define SCB_HFSR_DEBUGEVT_Pos              31U
#define SCB_HFSR_DEBUGEVT_Msk              (1UL << SCB_HFSR_DEBUGEVT_Pos)
#define SCB_HFSR_FORCED_Pos                30U
#define SCB_HFSR_FORCED_Msk                (1UL << SCB_HFSR_FORCED_Pos)
#define SCB_HFSR_VECTTBL_Pos                1U
#define SCB_HFSR_VECTTBL_Msk               (1UL << SCB_HFSR_VECTTBL_Pos)

#define SCB_DFSR_EXTERNAL_Pos               4U
#define SCB_DFSR_EXTERNAL_Msk              (1UL << SCB_DFSR_EXTERNAL_Pos)
#define SCB_DFSR_VCATCH_Pos                 3U
#define SCB_DFSR_VCATCH_Msk                (1UL << SCB_DFSR_VCATCH_Pos)
#define SCB_DFSR_DWTTRAP_Pos                2U
#define SCB_DFSR_DWTTRAP_Msk               (1UL << SCB_DFSR_DWTTRAP_Pos)
#define SCB_DFSR_BKPT_Pos                   1U
#define SCB_DFSR_BKPT_Msk                  (1UL << SCB_DFSR_BKPT_Pos)
#define SCB_DFSR_HALTED_Pos                 0U
#define SCB_DFSR_HALTED_Msk                (1UL << SCB_DFSR_HALTED_Pos)

/* ==========================================================================
 * SysTick Register Bit Definitions
 * ========================================================================== */
#define SysTick_CTRL_COUNTFLAG_Pos         16U
#define SysTick_CTRL_COUNTFLAG_Msk         (1UL << SysTick_CTRL_COUNTFLAG_Pos)
#define SysTick_CTRL_CLKSOURCE_Pos          2U
#define SysTick_CTRL_CLKSOURCE_Msk         (1UL << SysTick_CTRL_CLKSOURCE_Pos)
#define SysTick_CTRL_TICKINT_Pos            1U
#define SysTick_CTRL_TICKINT_Msk           (1UL << SysTick_CTRL_TICKINT_Pos)
#define SysTick_CTRL_ENABLE_Pos             0U
#define SysTick_CTRL_ENABLE_Msk            (1UL << SysTick_CTRL_ENABLE_Pos)

/* ==========================================================================
 * NVIC Register Bit Definitions
 * ========================================================================== */
#define NVIC_STIR_INTID_Pos                 0U
#define NVIC_STIR_INTID_Msk                (0x1FFUL << NVIC_STIR_INTID_Pos)

/* ==========================================================================
 * DWT Register Bit Definitions
 * ========================================================================== */
#define DWT_CTRL_NOCYCCNT_Pos              25U
#define DWT_CTRL_NOCYCCNT_Msk              (1UL << DWT_CTRL_NOCYCCNT_Pos)
#define DWT_CTRL_CYCCNTENA_Pos              0U
#define DWT_CTRL_CYCCNTENA_Msk             (1UL << DWT_CTRL_CYCCNTENA_Pos)

/* ==========================================================================
 * CoreDebug Register Bit Definitions
 * ========================================================================== */
#define CoreDebug_DHCSR_DBGKEY_Pos         16U
#define CoreDebug_DHCSR_DBGKEY_Msk         (0xFFFFUL << CoreDebug_DHCSR_DBGKEY_Pos)
#define CoreDebug_DHCSR_S_RESET_ST_Pos     25U
#define CoreDebug_DHCSR_S_RESET_ST_Msk     (1UL << CoreDebug_DHCSR_S_RESET_ST_Pos)
#define CoreDebug_DHCSR_S_RETIRE_ST_Pos    24U
#define CoreDebug_DHCSR_S_RETIRE_ST_Msk    (1UL << CoreDebug_DHCSR_S_RETIRE_ST_Pos)
#define CoreDebug_DHCSR_S_LOCKUP_Pos       19U
#define CoreDebug_DHCSR_S_LOCKUP_Msk       (1UL << CoreDebug_DHCSR_S_LOCKUP_Pos)
#define CoreDebug_DHCSR_S_SLEEP_Pos        18U
#define CoreDebug_DHCSR_S_SLEEP_Msk        (1UL << CoreDebug_DHCSR_S_SLEEP_Pos)
#define CoreDebug_DHCSR_S_HALT_Pos         17U
#define CoreDebug_DHCSR_S_HALT_Msk         (1UL << CoreDebug_DHCSR_S_HALT_Pos)
#define CoreDebug_DHCSR_C_DEBUGEN_Pos       0U
#define CoreDebug_DHCSR_C_DEBUGEN_Msk      (1UL << CoreDebug_DHCSR_C_DEBUGEN_Pos)

/* ==========================================================================
 * NVIC Functions
 * ========================================================================== */
__STATIC_FORCEINLINE void NVIC_EnableIRQ(IRQn_Type IRQn)
{
  if ((int32_t)(IRQn) >= 0)
  {
    NVIC->ISER[(((uint32_t)IRQn) >> 5UL)] = (uint32_t)(1UL << (((uint32_t)IRQn) & 0x1FUL));
  }
}

__STATIC_FORCEINLINE void NVIC_DisableIRQ(IRQn_Type IRQn)
{
  if ((int32_t)(IRQn) >= 0)
  {
    NVIC->ICER[(((uint32_t)IRQn) >> 5UL)] = (uint32_t)(1UL << (((uint32_t)IRQn) & 0x1FUL));
  }
}

__STATIC_FORCEINLINE uint32_t NVIC_GetPendingIRQ(IRQn_Type IRQn)
{
  if ((int32_t)(IRQn) >= 0)
  {
    return((uint32_t)(((NVIC->ISPR[(((uint32_t)IRQn) >> 5UL)] & (1UL << (((uint32_t)IRQn) & 0x1FUL))) != 0UL) ? 1UL : 0UL));
  }
  return(0U);
}

__STATIC_FORCEINLINE void NVIC_SetPendingIRQ(IRQn_Type IRQn)
{
  if ((int32_t)(IRQn) >= 0)
  {
    NVIC->ISPR[(((uint32_t)IRQn) >> 5UL)] = (uint32_t)(1UL << (((uint32_t)IRQn) & 0x1FUL));
  }
}

__STATIC_FORCEINLINE void NVIC_ClearPendingIRQ(IRQn_Type IRQn)
{
  if ((int32_t)(IRQn) >= 0)
  {
    NVIC->ICPR[(((uint32_t)IRQn) >> 5UL)] = (uint32_t)(1UL << (((uint32_t)IRQn) & 0x1FUL));
  }
}

__STATIC_FORCEINLINE uint32_t NVIC_GetActive(IRQn_Type IRQn)
{
  if ((int32_t)(IRQn) >= 0)
  {
    return((uint32_t)(((NVIC->IABR[(((uint32_t)IRQn) >> 5UL)] & (1UL << (((uint32_t)IRQn) & 0x1FUL))) != 0UL) ? 1UL : 0UL));
  }
  return(0U);
}

__STATIC_FORCEINLINE void NVIC_SetPriority(IRQn_Type IRQn, uint32_t priority)
{
  if ((int32_t)(IRQn) >= 0)
  {
    NVIC->IP[((uint32_t)IRQn)] = (uint8_t)((priority << (8U - __NVIC_PRIO_BITS)) & (uint32_t)0xFFUL);
  }
  else
  {
    SCB->SHP[(((uint32_t)IRQn) & 0xFUL) - 4UL] = (uint8_t)((priority << (8U - __NVIC_PRIO_BITS)) & (uint32_t)0xFFUL);
  }
}

__STATIC_FORCEINLINE uint32_t NVIC_GetPriority(IRQn_Type IRQn)
{
  if ((int32_t)(IRQn) >= 0)
  {
    return((uint32_t)(((uint32_t)NVIC->IP[((uint32_t)IRQn)]) >> (8U - __NVIC_PRIO_BITS)));
  }
  return((uint32_t)(((uint32_t)SCB->SHP[(((uint32_t)IRQn) & 0xFUL) - 4UL]) >> (8U - __NVIC_PRIO_BITS)));
}

__STATIC_FORCEINLINE uint32_t NVIC_EncodePriority(uint32_t PriorityGroup, uint32_t PreemptPriority, uint32_t SubPriority)
{
  uint32_t PriorityGroupTmp = (PriorityGroup & (uint32_t)0x07UL);
  uint32_t PreemptPriorityBits;
  uint32_t SubPriorityBits;

  PreemptPriorityBits = ((7UL - PriorityGroupTmp) > (uint32_t)(__NVIC_PRIO_BITS)) ? (uint32_t)(__NVIC_PRIO_BITS) : (uint32_t)(7UL - PriorityGroupTmp);
  SubPriorityBits     = ((PriorityGroupTmp + (uint32_t)(__NVIC_PRIO_BITS)) < (uint32_t)7UL) ? (uint32_t)0UL : (uint32_t)((PriorityGroupTmp - 7UL) + (uint32_t)(__NVIC_PRIO_BITS));

  return (((PreemptPriority & (uint32_t)((1UL << (PreemptPriorityBits)) - 1UL)) << SubPriorityBits) |
          ((SubPriority     & (uint32_t)((1UL << (SubPriorityBits    )) - 1UL))));
}

__STATIC_FORCEINLINE void NVIC_DecodePriority(uint32_t Priority, uint32_t PriorityGroup, uint32_t* const pPreemptPriority, uint32_t* const pSubPriority)
{
  uint32_t PriorityGroupTmp = (PriorityGroup & (uint32_t)0x07UL);
  uint32_t PreemptPriorityBits;
  uint32_t SubPriorityBits;

  PreemptPriorityBits = ((7UL - PriorityGroupTmp) > (uint32_t)(__NVIC_PRIO_BITS)) ? (uint32_t)(__NVIC_PRIO_BITS) : (uint32_t)(7UL - PriorityGroupTmp);
  SubPriorityBits     = ((PriorityGroupTmp + (uint32_t)(__NVIC_PRIO_BITS)) < (uint32_t)7UL) ? (uint32_t)0UL : (uint32_t)((PriorityGroupTmp - 7UL) + (uint32_t)(__NVIC_PRIO_BITS));

  *pPreemptPriority = (Priority >> SubPriorityBits) & (uint32_t)((1UL << (PreemptPriorityBits)) - 1UL);
  *pSubPriority     = (Priority                   ) & (uint32_t)((1UL << (SubPriorityBits    )) - 1UL);
}

__STATIC_FORCEINLINE void NVIC_SetVector(IRQn_Type IRQn, uint32_t vector)
{
  uint32_t *vectors = (uint32_t *)(SCB->VTOR);
  vectors[(int32_t)IRQn + 16] = vector;
}

__STATIC_FORCEINLINE uint32_t NVIC_GetVector(IRQn_Type IRQn)
{
  uint32_t *vectors = (uint32_t *)(SCB->VTOR);
  return vectors[(int32_t)IRQn + 16];
}

__NO_RETURN __STATIC_FORCEINLINE void __NVIC_SystemReset(void)
{
  __DSB();
  SCB->AIRCR = (uint32_t)((0x5FAUL << SCB_AIRCR_VECTKEY_Pos) |
                          (SCB->AIRCR & SCB_AIRCR_PRIGROUP_Msk) |
                          SCB_AIRCR_SYSRESETREQ_Msk);
  __DSB();
  for(;;)
  {
    __NOP();
  }
}

/* ==========================================================================
 * SCB Functions
 * ========================================================================== */
#define SCB_AIRCR_VECTKEY                 (0x5FAUL << SCB_AIRCR_VECTKEY_Pos)

__STATIC_FORCEINLINE uint32_t SCB_GetFPUType(void)
{
  return 0U;
}

__STATIC_FORCEINLINE void SCB_EnableICache(void)
{
  __DSB();
  __ISB();
}

__STATIC_FORCEINLINE void SCB_DisableICache(void)
{
  __DSB();
  __ISB();
