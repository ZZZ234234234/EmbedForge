/******************************************************************************
 * @file     mpu_armv7.h
 * @brief    CMSIS Core Peripheral Access Layer Header File for
 *           ARMv7-M MPU (Memory Protection Unit)
 * @version  V1.0.0
 * @date     2024
 ******************************************************************************/
/*
 * Copyright (c) 2017-2024 ARM Limited. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the License); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef ARM_MPU_ARMV7_H
#define ARM_MPU_ARMV7_H

#if defined ( __ICCARM__ )
  #pragma system_include
#endif

#include <stdint.h>

/* ==========================================================================
 * ARMv7-M MPU Register Definitions
 * ========================================================================== */

/** \brief  MPU Region Base Address Register (MPU_RBAR) bit fields */
#define MPU_RBAR_ADDR_Msk       (0xFFFFFFE0UL)  /* Region base address mask */
#define MPU_RBAR_VALID_Msk      (0x00000010UL)  /* Region number valid */
#define MPU_RBAR_REGION_Msk     (0x0000000FUL)  /* Region number mask */

/** \brief  MPU Region Attribute and Size Register (MPU_RASR) bit fields */
#define MPU_RASR_ATTRS_Msk      (0xFFFF0000UL)  /* Attribute bits mask */
#define MPU_RASR_XN_Msk         (0x10000000UL)  /* Instruction access disable */
#define MPU_RASR_AP_Msk         (0x07000000UL)  /* Access permission */
#define MPU_RASR_TEX_Msk        (0x00380000UL)  /* Type extension */
#define MPU_RASR_S_Msk          (0x00040000UL)  /* Shareable */
#define MPU_RASR_C_Msk          (0x00020000UL)  /* Cacheable */
#define MPU_RASR_B_Msk          (0x00010000UL)  /* Bufferable */
#define MPU_RASR_SRD_Msk        (0x0000FF00UL)  /* Sub-region disable */
#define MPU_RASR_SIZE_Msk       (0x0000001FUL)  /* Region size */
#define MPU_RASR_ENABLE_Msk     (0x00000001UL)  /* Region enable */

/* ==========================================================================
 * MPU Access Permission (AP) Encoding
 * ========================================================================== */
#define ARM_MPU_AP_NONE         0U  /* No access */
#define ARM_MPU_AP_PRIV_RW      1U  /* Privileged read/write */
#define ARM_MPU_AP_PRIV_RW_URO  2U  /* Privileged RW, unprivileged RO */
#define ARM_MPU_AP_FULL         3U  /* Full access */
#define ARM_MPU_AP_PRO          5U  /* Privileged read-only */
#define ARM_MPU_AP_RO           6U  /* Read-only */

/* ==========================================================================
 * MPU Region Size Encoding (SIZE field)
 * ========================================================================== */
#define ARM_MPU_REGION_SIZE_32B     (0x04U)
#define ARM_MPU_REGION_SIZE_64B     (0x05U)
#define ARM_MPU_REGION_SIZE_128B    (0x06U)
#define ARM_MPU_REGION_SIZE_256B    (0x07U)
#define ARM_MPU_REGION_SIZE_512B    (0x08U)
#define ARM_MPU_REGION_SIZE_1KB     (0x09U)
#define ARM_MPU_REGION_SIZE_2KB     (0x0AU)
#define ARM_MPU_REGION_SIZE_4KB     (0x0BU)
#define ARM_MPU_REGION_SIZE_8KB     (0x0CU)
#define ARM_MPU_REGION_SIZE_16KB    (0x0DU)
#define ARM_MPU_REGION_SIZE_32KB    (0x0EU)
#define ARM_MPU_REGION_SIZE_64KB    (0x0FU)
#define ARM_MPU_REGION_SIZE_128KB   (0x10U)
#define ARM_MPU_REGION_SIZE_256KB   (0x11U)
#define ARM_MPU_REGION_SIZE_512KB   (0x12U)
#define ARM_MPU_REGION_SIZE_1MB     (0x13U)
#define ARM_MPU_REGION_SIZE_2MB     (0x14U)
#define ARM_MPU_REGION_SIZE_4MB     (0x15U)
#define ARM_MPU_REGION_SIZE_8MB     (0x16U)
#define ARM_MPU_REGION_SIZE_16MB    (0x17U)
#define ARM_MPU_REGION_SIZE_32MB    (0x18U)
#define ARM_MPU_REGION_SIZE_64MB    (0x19U)
#define ARM_MPU_REGION_SIZE_128MB   (0x1AU)
#define ARM_MPU_REGION_SIZE_256MB   (0x1BU)
#define ARM_MPU_REGION_SIZE_512MB   (0x1CU)
#define ARM_MPU_REGION_SIZE_1GB     (0x1DU)
#define ARM_MPU_REGION_SIZE_2GB     (0x1EU)
#define ARM_MPU_REGION_SIZE_4GB     (0x1FU)

/* ==========================================================================
 * MPU Region Attribute Structure
 * ========================================================================== */
/**
 * \brief  MPU Region Configuration Structure
 */
typedef struct {
  uint32_t RBAR;  /*!< Region Base Address Register value */
  uint32_t RASR;  /*!< Region Attribute and Size Register value */
} ARM_MPU_Region_t;

/* ==========================================================================
 * MPU Region Attribute Helper Macros
 * ========================================================================== */

/**
 * \brief  Combine region attributes into a RASR value
 * \param  XN   Instruction access disable (0 = enabled, 1 = disabled)
 * \param  AP   Access permission (ARM_MPU_AP_xxx)
 * \param  TEX  Type extension
 * \param  S    Shareable
 * \param  C    Cacheable
 * \param  B    Bufferable
 * \param  SRD  Sub-region disable (8 bits)
 * \param  SIZE Region size (ARM_MPU_REGION_SIZE_xxx)
 */
#define ARM_MPU_RASR(XN, AP, TEX, S, C, B, SRD, SIZE) \
  ((((uint32_t)(XN)  << 28U) & MPU_RASR_XN_Msk)   | \
   (((uint32_t)(AP)  << 24U) & MPU_RASR_AP_Msk)   | \
   (((uint32_t)(TEX) << 19U) & MPU_RASR_TEX_Msk)  | \
   (((uint32_t)(S)   << 18U) & MPU_RASR_S_Msk)    | \
   (((uint32_t)(C)   << 17U) & MPU_RASR_C_Msk)    | \
   (((uint32_t)(B)   << 16U) & MPU_RASR_B_Msk)    | \
   (((uint32_t)(SRD) <<  8U) & MPU_RASR_SRD_Msk)  | \
   (((uint32_t)(SIZE)       ) & MPU_RASR_SIZE_Msk) | \
   MPU_RASR_ENABLE_Msk)

/**
 * \brief  Normal memory, non-shareable, write-back, write-allocate
 */
#define ARM_MPU_RASR_NORMAL_WBWA(XN, AP, SRD, SIZE) \
  ARM_MPU_RASR(XN, AP, 0x01U, 0U, 1U, 1U, SRD, SIZE)

/**
 * \brief  Normal memory, non-shareable, write-through
 */
#define ARM_MPU_RASR_NORMAL_WT(XN, AP, SRD, SIZE) \
  ARM_MPU_RASR(XN, AP, 0x00U, 0U, 1U, 0U, SRD, SIZE)

/**
 * \brief  Normal memory, non-shareable, non-cacheable
 */
#define ARM_MPU_RASR_NORMAL_NC(XN, AP, SRD, SIZE) \
  ARM_MPU_RASR(XN, AP, 0x01U, 0U, 0U, 0U, SRD, SIZE)

/**
 * \brief  Device memory, shareable
 */
#define ARM_MPU_RASR_DEVICE(XN, AP, SRD, SIZE) \
  ARM_MPU_RASR(XN, AP, 0x00U, 1U, 0U, 1U, SRD, SIZE)

/**
 * \brief  Strongly-ordered memory
 */
#define ARM_MPU_RASR_STRONGLY_ORDERED(XN, AP, SRD, SIZE) \
  ARM_MPU_RASR(XN, AP, 0x00U, 1U, 0U, 0U, SRD, SIZE)

/* ==========================================================================
 * MPU Region Configuration Helper Functions
 * ========================================================================== */

/**
 * \brief  Configure an MPU region
 * \param  region  Region number (0-7 for ARMv7-M)
 * \param  base    Region base address
 * \param  attr    Region attributes (RASR value)
 */
__STATIC_INLINE void ARM_MPU_SetRegion(uint32_t region, uint32_t base, uint32_t attr)
{
  MPU->RBAR = (base & MPU_RBAR_ADDR_Msk) | MPU_RBAR_VALID_Msk | (region & MPU_RBAR_REGION_Msk);
  MPU->RASR = attr;
}

/**
 * \brief  Enable the MPU
 */
__STATIC_INLINE void ARM_MPU_Enable(uint32_t mode)
{
  MPU->CTRL = mode | MPU_CTRL_ENABLE_Msk;
  __DSB();
  __ISB();
}

/**
 * \brief  Disable the MPU
 */
__STATIC_INLINE void ARM_MPU_Disable(void)
{
  __DMB();
  MPU->CTRL = 0U;
  __DSB();
  __ISB();
}

/**
 * \brief  Clear all MPU regions
 */
__STATIC_INLINE void ARM_MPU_ClrRegion(uint32_t region)
{
  MPU->RNR  = region;
  MPU->RASR = 0U;
}

/**
 * \brief  Load a region configuration from a structure
 * \param  region  Region number
 * \param  config  Pointer to region configuration structure
 */
__STATIC_INLINE void ARM_MPU_LoadRegion(uint32_t region, const ARM_MPU_Region_t *config)
{
  MPU->RNR  = region;
  MPU->RBAR = config->RBAR;
  MPU->RASR = config->RASR;
}

#endif /* ARM_MPU_ARMV7_H */
