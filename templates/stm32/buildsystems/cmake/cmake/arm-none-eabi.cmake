# {{PROJECT_NAME}} - arm-none-eabi 交叉编译工具链
#
# 用法：
#   cmake -B build -DCMAKE_TOOLCHAIN_FILE=cmake/arm-none-eabi.cmake
#   cmake --build build
#
# 若 arm-none-eabi-gcc 不在 PATH 中，配置时追加：
#   -DTOOLCHAIN_PREFIX=/path/to/gcc-arm-none-eabi/bin/arm-none-eabi-

set(CMAKE_SYSTEM_NAME Generic)
set(CMAKE_SYSTEM_PROCESSOR arm)

# 裸机目标的构建产物是 .elf，不是宿主机可执行文件；
# 不设这个变量时 CMake 会拿它去 Windows 上“运行”测试程序而报 Exec format error
set(CMAKE_TRY_COMPILE_TARGET_TYPE STATIC_LIBRARY)

# Windows 默认生成器是 NMake，而 NMake 需要 VS 构建环境；这里显式给一个不依赖 VS 的默认值。
# 已被 -G 或 CMakePresets 指定时不覆盖。
if(WIN32 AND NOT CMAKE_GENERATOR)
  set(CMAKE_GENERATOR "Unix Makefiles" CACHE STRING "" FORCE)
endif()

if(DEFINED TOOLCHAIN_PREFIX)
  set(CMAKE_C_COMPILER   ${TOOLCHAIN_PREFIX}gcc)
  set(CMAKE_ASM_COMPILER ${TOOLCHAIN_PREFIX}gcc)
  set(CMAKE_OBJCOPY      ${TOOLCHAIN_PREFIX}objcopy)
  set(CMAKE_SIZE         ${TOOLCHAIN_PREFIX}size)
else()
  set(CMAKE_C_COMPILER   arm-none-eabi-gcc)
  set(CMAKE_ASM_COMPILER arm-none-eabi-gcc)
  set(CMAKE_OBJCOPY      arm-none-eabi-objcopy)
  set(CMAKE_SIZE         arm-none-eabi-size)
endif()

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)
