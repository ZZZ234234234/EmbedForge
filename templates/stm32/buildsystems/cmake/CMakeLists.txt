# {{PROJECT_NAME}} - STM32 (HAL + arm-none-eabi-gcc + CMake)
#
# 交叉编译工具链在 cmake/arm-none-eabi.cmake 中配置，因此第一次配置要显式传入：
#   cmake -B build -DCMAKE_TOOLCHAIN_FILE=cmake/arm-none-eabi.cmake
#   cmake --build build
#
# Windows 上如果没有装 Visual Studio / NMake，CMake 默认会挑 NMake 生成器并失败，
# 请显式指定生成器（本项目已附 CMakePresets.json，用 `cmake --preset debug` 最省事）：
#   cmake -B build -G "Unix Makefiles" -DCMAKE_TOOLCHAIN_FILE=cmake/arm-none-eabi.cmake
#
# 换芯片时同步改三处：CPU 参数、LDSCRIPT、STM32F103xB 宏定义。

cmake_minimum_required(VERSION 3.20)

# 注意：CMAKE_SYSTEM_NAME / CMAKE_SYSTEM_PROCESSOR 由工具链文件设置。
# 不要在这里重复设置，否则 CMake 会以“命令行/CMakeLists 覆盖工具链”的顺序告警并可能失效。

project({{PROJECT_NAME_SAFE}} C ASM)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

# -fno-common / -specs=nano.specs 由工具链文件提供，避免在 try_compile 阶段链接失败
set(CMAKE_TRY_COMPILE_TARGET_TYPE STATIC_LIBRARY)

set(MCU_FLAGS -mcpu=cortex-m3 -mthumb)
set(LDSCRIPT  ${CMAKE_CURRENT_SOURCE_DIR}/STM32F103C8Tx_FLASH.ld)

file(GLOB APP_SOURCES   ${CMAKE_CURRENT_SOURCE_DIR}/Core/Src/*.c)
file(GLOB BSP_SOURCES   ${CMAKE_CURRENT_SOURCE_DIR}/Drivers/BSP/*.c)
file(GLOB HAL_SOURCES   ${CMAKE_CURRENT_SOURCE_DIR}/Drivers/STM32F1xx_HAL_Driver/Src/*.c)
set(ASM_SOURCES         ${CMAKE_CURRENT_SOURCE_DIR}/startup_stm32f103xb.s)

add_executable({{PROJECT_NAME_SAFE}}
  ${APP_SOURCES}
  ${BSP_SOURCES}
  ${HAL_SOURCES}
  ${ASM_SOURCES}
)

target_include_directories({{PROJECT_NAME_SAFE}} PRIVATE
  ${CMAKE_CURRENT_SOURCE_DIR}/Core/Inc
  ${CMAKE_CURRENT_SOURCE_DIR}/Drivers/STM32F1xx_HAL_Driver/Inc
  ${CMAKE_CURRENT_SOURCE_DIR}/Drivers/CMSIS/Device/ST/STM32F1xx/Include
  ${CMAKE_CURRENT_SOURCE_DIR}/Drivers/CMSIS/Include
  ${CMAKE_CURRENT_SOURCE_DIR}/Drivers/BSP
)

target_compile_definitions({{PROJECT_NAME_SAFE}} PRIVATE USE_HAL_DRIVER STM32F103xB)

target_compile_options({{PROJECT_NAME_SAFE}} PRIVATE
  ${MCU_FLAGS}
  -Os -g3 -Wall -Wextra
  -ffunction-sections -fdata-sections
)

target_link_options({{PROJECT_NAME_SAFE}} PRIVATE
  ${MCU_FLAGS}
  -T${LDSCRIPT}
  -specs=nano.specs
  -specs=nosys.specs
  -Wl,--gc-sections
  -Wl,-Map=${CMAKE_CURRENT_BINARY_DIR}/{{PROJECT_NAME_SAFE}}.map
)

# 生成 .bin，方便 st-flash 直接烧录
add_custom_command(TARGET {{PROJECT_NAME_SAFE}} POST_BUILD
  COMMAND ${CMAKE_OBJCOPY} -O binary -S $<TARGET_FILE:{{PROJECT_NAME_SAFE}}> $<TARGET_FILE_DIR:{{PROJECT_NAME_SAFE}}>/{{PROJECT_NAME_SAFE}}.bin
  COMMENT "OBJCOPY {{PROJECT_NAME_SAFE}}.bin"
)

# 烧录（需 ST-Link 与 st-flash）
add_custom_target(flash
  COMMAND st-flash write $<TARGET_FILE_DIR:{{PROJECT_NAME_SAFE}}>/{{PROJECT_NAME_SAFE}}.bin 0x08000000
  DEPENDS {{PROJECT_NAME_SAFE}}
  COMMENT "st-flash write 0x08000000"
)
