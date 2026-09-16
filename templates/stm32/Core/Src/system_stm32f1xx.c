/**
  ******************************************************************************
  * @file    system_stm32f1xx.c
  * @brief   CMSIS Cortex-M3 Device Peripheral Access Layer System Source File
  *          for STM32F103xB.
  *
  *          This file provides two functions and one global variable to be
  *          called from user application software:
  *            - SystemInit() : called at startup before branch to main().
  *            - SystemCoreClock variable : updated with HCLK frequency.
  *            - SystemCoreClockUpdate() : recompute SystemCoreClock.
  *
  *          Clock configuration for this project:
  *            HSE = 8 MHz, PLL x9 -> SYSCLK = 72 MHz, AHB = 72 MHz,
  *            APB1 = 36 MHz, APB2 = 72 MHz.
  *          If HSE fails to start, fall back to HSI (8 MHz) with PLL x2
  *          (HSI/2 * 16 = 64 MHz) is NOT used here; instead we keep HSI
  *          directly at 8 MHz to guarantee the MCU always runs.
  ******************************************************************************
  */

#include "stm32f1xx.h"

/* -------------------------------------------------------------------------- */
/*  Uncomment the line below to enable the HSE_VALUE definition in this file. */
/*  (HSE_VALUE is normally defined in stm32f1xx_hal_conf.h)                   */
/* -------------------------------------------------------------------------- */
/* #define HSE_VALUE    8000000U */

/* -------------------------------------------------------------------------- */
/*  Uncomment the line below to enable the HSI_VALUE definition in this file. */
/* -------------------------------------------------------------------------- */
/* #define HSI_VALUE    8000000U */

/* -------------------------------------------------------------------------- */
/*  System Core Clock variable                                                */
/* -------------------------------------------------------------------------- */
uint32_t SystemCoreClock = 8000000U;   /* Default: HSI = 8 MHz */

/* -------------------------------------------------------------------------- */
/*  Internal constants                                                        */
/* -------------------------------------------------------------------------- */
#define HSE_STARTUP_TIMEOUT   ((uint16_t)0x0500U)  /* HSE start-up timeout    */
#define HSI_STARTUP_TIMEOUT   ((uint16_t)0x0500U)  /* HSI start-up timeout    */

#define PLL_MULTIPLIER_9      ((uint32_t)0x00070000U) /* PLLMUL = x9           */
#define PLL_SOURCE_HSE        ((uint32_t)0x00010000U) /* PLLSRC = HSE          */
#define PLL_ON                ((uint32_t)0x01000000U) /* PLLON                 */
#define PLL_READY             ((uint32_t)0x02000000U) /* PLLRDY                */

#define HSE_ON                ((uint32_t)0x00010000U) /* HSEON                 */
#define HSE_READY             ((uint32_t)0x00020000U) /* HSERDY                */

#define HSI_ON                ((uint32_t)0x00000001U) /* HSION                 */
#define HSI_READY             ((uint32_t)0x00000002U) /* HSIRDY                */

#define SW_HSI                ((uint32_t)0x00000000U) /* SW = HSI              */
#define SW_HSE                ((uint32_t)0x00000001U) /* SW = HSE              */
#define SW_PLL                ((uint32_t)0x00000002U) /* SW = PLL              */
#define SWS_MASK              ((uint32_t)0x0000000CU) /* SWS mask              */
#define SWS_HSI               ((uint32_t)0x00000000U) /* SWS = HSI             */
#define SWS_HSE               ((uint32_t)0x00000004U) /* SWS = HSE             */
#define SWS_PLL               ((uint32_t)0x00000008U) /* SWS = PLL             */

#define FLASH_ACR_LATENCY_2   ((uint32_t)0x00000002U) /* 2 wait states         */
#define FLASH_ACR_PRFTBE      ((uint32_t)0x00000010U) /* Prefetch buffer enable*/

#define RCC_CFGR_HPRE_DIV1    ((uint32_t)0x00000000U)
#define RCC_CFGR_PPRE1_DIV2   ((uint32_t)0x00000400U)
#define RCC_CFGR_PPRE2_DIV1   ((uint32_t)0x00000000U)

/* -------------------------------------------------------------------------- */
/*  SystemInit                                                                */
/* -------------------------------------------------------------------------- */
/**
  * @brief  Setup the microcontroller system.
  *         Initialize the Embedded Flash Interface, the PLL and update the
  *         SystemCoreClock variable.
  * @note   This function should be used only after reset.
  *         If HSE fails to start within the timeout, the system falls back
  *         to HSI (8 MHz) so the MCU always runs.
  */
void SystemInit(void)
{
    uint32_t  timeout;
    uint32_t  cfgr;

    /* ---------------------------------------------------------------------- */
    /* 1. Reset RCC clock configuration to the default reset state            */
    /* ---------------------------------------------------------------------- */
    RCC->CR |= HSI_ON;                       /* Enable HSI                     */
    RCC->CFGR = 0x00000000U;                 /* Reset CFGR                     */
    RCC->CR &= ~(HSE_ON | PLL_ON);           /* Disable HSE and PLL            */
    RCC->CIR = 0x00000000U;                  /* Disable all interrupts         */

    /* ---------------------------------------------------------------------- */
    /* 2. Configure Flash: enable prefetch, set 2 wait states (for 48-72 MHz) */
    /* ---------------------------------------------------------------------- */
    FLASH->ACR = FLASH_ACR_PRFTBE | FLASH_ACR_LATENCY_2;

    /* ---------------------------------------------------------------------- */
    /* 3. Configure the clock source and PLL                                  */
    /* ---------------------------------------------------------------------- */

    /* --- 3a. Try to start HSE (8 MHz external crystal) ------------------- */
    RCC->CR |= HSE_ON;
    timeout = HSE_STARTUP_TIMEOUT;
    while (((RCC->CR & HSE_READY) == 0U) && (timeout > 0U))
    {
        timeout--;
    }

    if ((RCC->CR & HSE_READY) != 0U)
    {
        /* HSE started successfully -> configure PLL: HSE x9 = 72 MHz       */
        cfgr  = RCC->CFGR;
        cfgr &= ~(0x003F0000U);              /* Clear PLLMUL[3:0] and PLLSRC   */
        cfgr |= PLL_MULTIPLIER_9 | PLL_SOURCE_HSE;
        cfgr &= ~(0x0000F000U);              /* Clear HPRE[3:0]  -> /1         */
        cfgr |= RCC_CFGR_HPRE_DIV1;
        cfgr &= ~(0x00000700U);              /* Clear PPRE1[2:0] -> /2         */
        cfgr |= RCC_CFGR_PPRE1_DIV2;
        cfgr &= ~(0x00003800U);              /* Clear PPRE2[2:0] -> /1         */
        cfgr |= RCC_CFGR_PPRE2_DIV1;
        RCC->CFGR = cfgr;

        /* Enable PLL and wait for lock                                     */
        RCC->CR |= PLL_ON;
        timeout = HSE_STARTUP_TIMEOUT;
        while (((RCC->CR & PLL_READY) == 0U) && (timeout > 0U))
        {
            timeout--;
        }

        if ((RCC->CR & PLL_READY) != 0U)
        {
            /* Switch SYSCLK to PLL                                         */
            RCC->CFGR &= ~(0x00000003U);
            RCC->CFGR |= SW_PLL;
            timeout = HSE_STARTUP_TIMEOUT;
            while (((RCC->CFGR & SWS_MASK) != SWS_PLL) && (timeout > 0U))
            {
                timeout--;
            }

            if ((RCC->CFGR & SWS_MASK) == SWS_PLL)
            {
                /* SYSCLK = 72 MHz                                          */
                SystemCoreClock = 72000000U;
                return;
            }
        }

        /* PLL failed -> fall through to HSI fallback                       */
        RCC->CR &= ~PLL_ON;
    }

    /* ---------------------------------------------------------------------- */
    /* 4. HSE or PLL failed -> fall back to HSI (8 MHz)                       */
    /* ---------------------------------------------------------------------- */
    RCC->CR |= HSI_ON;
    timeout = HSI_STARTUP_TIMEOUT;
    while (((RCC->CR & HSI_READY) == 0U) && (timeout > 0U))
    {
        timeout--;
    }

    /* Switch SYSCLK to HSI                                                 */
    RCC->CFGR &= ~(0x00000003U);
    RCC->CFGR |= SW_HSI;
    timeout = HSI_STARTUP_TIMEOUT;
    while (((RCC->CFGR & SWS_MASK) != SWS_HSI) && (timeout > 0U))
    {
        timeout--;
    }

    /* HSI = 8 MHz, AHB = /1, APB1 = /1, APB2 = /1                          */
    RCC->CFGR &= ~(0x0000F000U);
    RCC->CFGR |= RCC_CFGR_HPRE_DIV1;
    RCC->CFGR &= ~(0x00000700U);
    RCC->CFGR &= ~(0x00003800U);

    /* Adjust Flash latency for 8 MHz (0 wait states)                       */
    FLASH->ACR = FLASH_ACR_PRFTBE;

    SystemCoreClock = 8000000U;
}

/* -------------------------------------------------------------------------- */
/*  SystemCoreClockUpdate                                                     */
/* -------------------------------------------------------------------------- */
/**
  * @brief  Update SystemCoreClock variable according to Clock Register Values.
  *         The SystemCoreClock variable contains the core clock (HCLK), it can
  *         be used by the user application to setup the SysTick timer or
  *         configure other parameters.
  */
void SystemCoreClockUpdate(void)
{
    uint32_t tmp;
    uint32_t pllmull;
    uint32_t pllsource;
    uint32_t prediv1factor;
    uint32_t prediv2factor;
    uint32_t pll2factor;
    uint32_t hclk;

    /* Get SYSCLK source --------------------------------------------------- */
    tmp = RCC->CFGR & SWS_MASK;

    switch (tmp)
    {
        case SWS_HSI:   /* HSI used as system clock */
            SystemCoreClock = HSI_VALUE;
            break;

        case SWS_HSE:   /* HSE used as system clock */
            SystemCoreClock = HSE_VALUE;
            break;

        case SWS_PLL:   /* PLL used as system clock */
            /* Get PLL clock source and multiplication factor               */
            pllmull   = RCC->CFGR & 0x003C0000U;
            pllsource = RCC->CFGR & 0x00010000U;

            pllmull = (pllmull >> 18) + 2U;

            if (pllsource == 0x00000000U)
            {
                /* HSI oscillator clock / 2 selected as PLL clock entry     */
                SystemCoreClock = (HSI_VALUE >> 1) * pllmull;
            }
            else
            {
                /* HSE selected as PLL clock entry                          */
                if ((RCC->CFGR & 0x00010000U) != 0U)
                {
                    /* HSE oscillator clock selected as PREDIV1 clock entry */
                    SystemCoreClock = (HSE_VALUE / 1U) * pllmull;
                }
                else
                {
                    SystemCoreClock = HSE_VALUE * pllmull;
                }
            }
            break;

        default:
            SystemCoreClock = HSI_VALUE;
            break;
    }

    /* Compute HCLK clock frequency ---------------------------------------- */
    tmp = RCC->CFGR & 0x0000F000U;
    tmp = tmp >> 4;

    switch (tmp)
    {
        case 0x00U: hclk = SystemCoreClock;            break; /* /1            */
        case 0x08U: hclk = SystemCoreClock >> 1;       break; /* /2            */
        case 0x09U: hclk = SystemCoreClock >> 2;       break; /* /4            */
        case 0x0AU: hclk = SystemCoreClock >> 3;       break; /* /8            */
        case 0x0BU: hclk = SystemCoreClock >> 4;       break; /* /16           */
        case 0x0CU: hclk = SystemCoreClock >> 6;       break; /* /64           */
        case 0x0DU: hclk = SystemCoreClock >> 7;       break; /* /128          */
        case 0x0EU: hclk = SystemCoreClock >> 8;       break; /* /256          */
        case 0x0FU: hclk = SystemCoreClock >> 9;       break; /* /512          */
        default:    hclk = SystemCoreClock;            break;
    }

    SystemCoreClock = hclk;
}
