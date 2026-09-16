/**
  ******************************************************************************
  * @file    stm32f1xx_hal_rcc_ex.c
  * @brief   RCC Extended HAL module driver.
  *          This file provides firmware functions to manage the following
  *          functionalities of the Reset and Clock Control (RCC) peripheral:
  *           + Internal/external clocks ready to use
  *           + Peripheral clocks enable/disable
  *           + Peripheral reset
  *           + RCC interrupts
  *
  ******************************************************************************
  */

/* Includes ------------------------------------------------------------------*/
#include "stm32f1xx_hal.h"

/** @addtogroup STM32F1xx_HAL_Driver
  * @{
  */

/** @defgroup RCCEx RCCEx
  * @brief RCC Extended HAL module driver
  * @{
  */

#ifdef HAL_RCC_MODULE_ENABLED

/* Private typedef -----------------------------------------------------------*/
/* Private defines -----------------------------------------------------------*/
/** @defgroup RCCEx_Private_Constants RCCEx Private Constants
  * @{
  */
#define PLL_TIMEOUT_VALUE          2U      /* 2 ms (minimum Tick + 1) */
#define CLOCKSWITCH_TIMEOUT_VALUE  5000U   /* 5 s    */
/**
  * @}
  */

/* Private macros ------------------------------------------------------------*/
/* Private variables ---------------------------------------------------------*/
/* Private function prototypes -----------------------------------------------*/
/* Exported functions --------------------------------------------------------*/

/** @defgroup RCCEx_Exported_Functions RCCEx Exported Functions
  * @{
  */

/** @defgroup RCCEx_Exported_Functions_Group1 Extended Peripheral Control functions
  *  @brief  Extended Peripheral Control functions
  *
@verbatim
 ===============================================================================
                ##### Extended Peripheral Control functions  #####
 ===============================================================================
    [..]
    This subsection provides a set of functions allowing to control the RCC Clocks
    sources.

@endverbatim
  * @{
  */

/**
  * @brief  Initializes the RCC extended peripherals clocks according to the specified
  *         parameters in the RCC_PeriphCLKInitTypeDef.
  * @param  PeriphClkInit pointer to an RCC_PeriphCLKInitTypeDef structure that
  *         contains the configuration information for the Extended Peripherals
  *         clocks(ADC, RTC, USB, SDIO, TIM, USART, I2C, SPI).
  * @retval HAL status
  */
HAL_StatusTypeDef HAL_RCCEx_PeriphCLKConfig(RCC_PeriphCLKInitTypeDef  *PeriphClkInit)
{
  uint32_t tickstart = 0U;
  uint32_t tmpregister = 0U;

  /* Check the parameters */
  assert_param(IS_RCC_PERIPHCLOCK(PeriphClkInit->PeriphClockSelection));

  /*---------------------------- RTC configuration ---------------------------*/
  if (((PeriphClkInit->PeriphClockSelection) & RCC_PERIPHCLK_RTC) == (RCC_PERIPHCLK_RTC))
  {
    /* Check for RTC Parameters used to output RTCCLK */
    assert_param(IS_RCC_RTCCLKSOURCE(PeriphClkInit->RTCClockSelection));

    /* Enable Power Clock*/
    __HAL_RCC_PWR_CLK_ENABLE();

    /* Enable write access to Backup domain */
    PWR->CR |= PWR_CR_DBP;

    /* Get tick */
    tickstart = HAL_GetTick();

    while ((PWR->CR & PWR_CR_DBP) == RESET)
    {
      if ((HAL_GetTick() - tickstart) > RCC_DBP_TIMEOUT_VALUE)
      {
        return HAL_TIMEOUT;
      }
    }
    /* Reset the Backup domain only if the RTC Clock source selection is modified */
    tmpregister = RCC->BDCR;

    if ((tmpregister & RCC_BDCR_RTCSEL) != PeriphClkInit->RTCClockSelection)
    {
      /* Store the content of BDCR register before the reset of Backup Domain */
      tmpregister = (RCC->BDCR & ~(RCC_BDCR_RTCSEL));
      /* RTC Clock selection can be changed only if the Backup Domain is reset */
      __HAL_RCC_BACKUPRESET_FORCE();
      __HAL_RCC_BACKUPRESET_RELEASE();
      /* Restore the Content of BDCR register */
      RCC->BDCR = tmpregister;
    }

    /* Wait for LSE ready */
    if (PeriphClkInit->RTCClockSelection == RCC_RTCCLKSOURCE_LSE)
    {
      /* Get tick */
      tickstart = HAL_GetTick();

      while (__HAL_RCC_GET_FLAG(RCC_FLAG_LSERDY) == RESET)
      {
        if ((HAL_GetTick() - tickstart) > LSE_TIMEOUT_VALUE)
        {
          return HAL_TIMEOUT;
        }
      }
    }
    /* Wait for LSI ready */
    else if (PeriphClkInit->RTCClockSelection == RCC_RTCCLKSOURCE_LSI)
    {
      /* Get tick */
      tickstart = HAL_GetTick();

      while (__HAL_RCC_GET_FLAG(RCC_FLAG_LSIRDY) == RESET)
      {
        if ((HAL_GetTick() - tickstart) > LSI_TIMEOUT_VALUE)
        {
          return HAL_TIMEOUT;
        }
      }
    }
    else /* HSE selected as RTC clock */
    {
      /* Get tick */
      tickstart = HAL_GetTick();

      while (__HAL_RCC_GET_FLAG(RCC_FLAG_HSERDY) == RESET)
      {
        if ((HAL_GetTick() - tickstart) > HSE_TIMEOUT_VALUE)
        {
          return HAL_TIMEOUT;
        }
      }
    }

    __HAL_RCC_RTC_CONFIG(PeriphClkInit->RTCClockSelection);
  }

  /*------------------------------- USART1 Configuration ----------------------*/
  if (((PeriphClkInit->PeriphClockSelection) & RCC_PERIPHCLK_USART1) == RCC_PERIPHCLK_USART1)
  {
    /* Check the parameters */
    assert_param(IS_RCC_USART1CLKSOURCE(PeriphClkInit->Usart1ClockSelection));

    /* Configure the USART1 clock source */
    __HAL_RCC_USART1_CONFIG(PeriphClkInit->Usart1ClockSelection);
  }

#if defined(RCC_CFGR_USBPRE)
  /*----------------------------- USB Configuration ---------------------------*/
  if (((PeriphClkInit->PeriphClockSelection) & RCC_PERIPHCLK_USB) == (RCC_PERIPHCLK_USB))
  {
    assert_param(IS_RCC_USBCLKSOURCE(PeriphClkInit->UsbClockSelection));

    __HAL_RCC_USB_CONFIG(PeriphClkInit->UsbClockSelection);
  }
#endif /* RCC_CFGR_USBPRE */

#if defined(RCC_CFGR_ADCPRE)
  /*----------------------------- ADC Configuration ---------------------------*/
  if (((PeriphClkInit->PeriphClockSelection) & RCC_PERIPHCLK_ADC) == RCC_PERIPHCLK_ADC)
  {
    /* Check the parameters */
    assert_param(IS_RCC_ADCCLKSOURCE(PeriphClkInit->AdcClockSelection));

    /* Configure the ADC clock source */
    __HAL_RCC_ADC_CONFIG(PeriphClkInit->AdcClockSelection);
  }
#endif /* RCC_CFGR_ADCPRE */

  return HAL_OK;
}

/**
  * @brief  Returns the peripheral clock configuration
  * @param  PeriphClkInit pointer to an RCC_PeriphCLKInitTypeDef structure that
  *         returns the configuration information for the Extended Peripherals
  *         clocks(ADC, RTC, USB, SDIO, TIM, USART, I2C, SPI).
  * @retval None
  */
void HAL_RCCEx_GetPeriphCLKConfig(RCC_PeriphCLKInitTypeDef  *PeriphClkInit)
{
  uint32_t tempreg;

  /* Set all possible values for the extended clock type parameter------------*/
  PeriphClkInit->PeriphClockSelection = RCC_PERIPHCLK_USART1 | RCC_PERIPHCLK_RTC;

  /* Get the RTC configuration -----------------------------------------------*/
  tempreg = (RCC->BDCR & RCC_BDCR_RTCSEL);
  if (tempreg == RCC_BDCR_RTCSEL_0)
  {
    PeriphClkInit->RTCClockSelection = RCC_RTCCLKSOURCE_LSE;
  }
  else if (tempreg == RCC_BDCR_RTCSEL_1)
  {
    PeriphClkInit->RTCClockSelection = RCC_RTCCLKSOURCE_LSI;
  }
  else
  {
    PeriphClkInit->RTCClockSelection = RCC_RTCCLKSOURCE_HSE_DIV128;
  }

  /* Get the USART1 clock source ---------------------------------------------*/
  tempreg = (RCC->CFGR & RCC_CFGR_USBPRE);
  if (tempreg == RCC_CFGR_USBPRE)
  {
    PeriphClkInit->Usart1ClockSelection = RCC_USART1CLKSOURCE_PCLK1;
  }
  else
  {
    PeriphClkInit->Usart1ClockSelection = RCC_USART1CLKSOURCE_SYSCLK;
  }

#if defined(RCC_CFGR_USBPRE)
  /* Get the USB clock source ------------------------------------------------*/
  PeriphClkInit->PeriphClockSelection |= RCC_PERIPHCLK_USB;
  tempreg = (RCC->CFGR & RCC_CFGR_USBPRE);
  if (tempreg == RCC_CFGR_USBPRE)
  {
    PeriphClkInit->UsbClockSelection = RCC_USBCLKSOURCE_PLL;
  }
  else
  {
    PeriphClkInit->UsbClockSelection = RCC_USBCLKSOURCE_PLL_DIV1_5;
  }
#endif /* RCC_CFGR_USBPRE */

#if defined(RCC_CFGR_ADCPRE)
  /* Get the ADC clock source ------------------------------------------------*/
  PeriphClkInit->PeriphClockSelection |= RCC_PERIPHCLK_ADC;
  tempreg = (RCC->CFGR & RCC_CFGR_ADCPRE);
  if (tempreg == RCC_CFGR_ADCPRE_DIV2)
  {
    PeriphClkInit->AdcClockSelection = RCC_ADCPCLK2_DIV2;
  }
  else if (tempreg == RCC_CFGR_ADCPRE_DIV4)
  {
    PeriphClkInit->AdcClockSelection = RCC_ADCPCLK2_DIV4;
  }
  else if (tempreg == RCC_CFGR_ADCPRE_DIV6)
  {
    PeriphClkInit->AdcClockSelection = RCC_ADCPCLK2_DIV6;
  }
  else
  {
    PeriphClkInit->AdcClockSelection = RCC_ADCPCLK2_DIV8;
  }
#endif /* RCC_CFGR_ADCPRE */
}

/**
  * @brief  Returns the RCC clock frequency used to generate the peripheral clock.
  * @param  PeriphClk Peripheral identifier for the peripheral clock
  * @retval Peripheral clock frequency (in Hz)
  */
uint32_t HAL_RCCEx_GetPeriphCLKFreq(uint32_t PeriphClk)
{
  uint32_t frequency = 0U;
  uint32_t tempreg;
  uint32_t pllmull = 0U, pllsource = 0U, prediv1factor = 0U;

  /* Check the parameters */
  assert_param(IS_RCC_PERIPHCLOCK(PeriphClk));

  switch (PeriphClk)
  {
    case RCC_PERIPHCLK_USART1:
      /* Get the current USART1 clock source ----------------------------------*/
      tempreg = (RCC->CFGR & RCC_CFGR_USBPRE);
      if (tempreg == RCC_CFGR_USBPRE)
      {
        /* USART1 Clock is PCLK1 */
        frequency = HAL_RCC_GetPCLK1Freq();
      }
      else
      {
        /* USART1 Clock is SYSCLK */
        frequency = HAL_RCC_GetSysClockFreq();
      }
      break;

    case RCC_PERIPHCLK_RTC:
      /* Get the current RTC clock source -------------------------------------*/
      tempreg = (RCC->BDCR & RCC_BDCR_RTCSEL);
      if (tempreg == RCC_BDCR_RTCSEL_0)
      {
        /* RTC Clock is LSE */
        frequency = LSE_VALUE;
      }
      else if (tempreg == RCC_BDCR_RTCSEL_1)
      {
        /* RTC Clock is LSI */
        frequency = LSI_VALUE;
      }
      else
      {
        /* RTC Clock is HSE/128 */
        frequency = HSE_VALUE / 128U;
      }
      break;

#if defined(RCC_CFGR_USBPRE)
    case RCC_PERIPHCLK_USB:
      /* Get the current USB clock source -------------------------------------*/
      tempreg = (RCC->CFGR & RCC_CFGR_USBPRE);
      if (tempreg == RCC_CFGR_USBPRE)
      {
        /* USB Clock is PLL */
        frequency = HAL_RCC_GetSysClockFreq();
      }
      else
      {
        /* USB Clock is PLL/1.5 */
        frequency = (HAL_RCC_GetSysClockFreq() * 2U) / 3U;
      }
      break;
#endif /* RCC_CFGR_USBPRE */

#if defined(RCC_CFGR_ADCPRE)
    case RCC_PERIPHCLK_ADC:
      /* Get the current ADC clock source -------------------------------------*/
      tempreg = (RCC->CFGR & RCC_CFGR_ADCPRE);
      if (tempreg == RCC_CFGR_ADCPRE_DIV2)
      {
        frequency = HAL_RCC_GetPCLK2Freq() / 2U;
      }
      else if (tempreg == RCC_CFGR_ADCPRE_DIV4)
      {
        frequency = HAL_RCC_GetPCLK2Freq() / 4U;
      }
      else if (tempreg == RCC_CFGR_ADCPRE_DIV6)
      {
        frequency = HAL_RCC_GetPCLK2Freq() / 6U;
      }
      else
      {
        frequency = HAL_RCC_GetPCLK2Freq() / 8U;
      }
      break;
#endif /* RCC_CFGR_ADCPRE */

    default:
      break;
  }

  /* Silence unused variable warnings in configurations where they are not used */
  (void)pllmull;
  (void)pllsource;
  (void)prediv1factor;

  return frequency;
}

/**
  * @}
  */

/**
  * @}
  */

#endif /* HAL_RCC_MODULE_ENABLED */

/**
  * @}
  */

/**
  * @}
  */
