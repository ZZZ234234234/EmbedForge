import type { PlatformId, PlatformInfo } from './types.js';

/** 骨架文件：由模板自带，不依赖 AI */
export interface SkeletonFile {
  path: string;
  content: string;
}

export interface PlatformTemplate {
  info: PlatformInfo;
  skeleton: SkeletonFile[];
  /** 当 AI 规划未给出文件清单时，默认由 AI 生成的源文件 */
  defaultAiFiles: string[];
}

/** 将 {{NAME}} 占位符替换为实际值 */
export function renderSkeleton(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? '');
}

const GCC_WARNING_FLAGS =
  '-Wall -Wextra -Werror=return-type -ffunction-sections -fdata-sections -Wl,--gc-sections';

export const PLATFORM_TEMPLATES: Record<PlatformId, PlatformTemplate> = {
  'generic-c': {
    info: {
      id: 'generic-c',
      name: 'Generic C (bare-metal)',
      description: '通用裸机 C 工程，任意 MCU，Makefile 构建',
      buildHint: 'make && make flash（烧录命令取决于具体工具链，如 st-flash / openocd / avrdude）',
    },
    defaultAiFiles: ['src/main.c', 'include/config.h', 'src/app.c'],
    skeleton: [
      {
        path: 'Makefile',
        content: `# {{PROJECT_NAME}} - generic bare-metal C
CC      ?= gcc
TARGET  ?= {{PROJECT_NAME}}
BUILD   = build
SRC     = src
INC     = include

CFLAGS  = -std=c11 -Os ${GCC_WARNING_FLAGS} -I$(INC)
LDFLAGS = -Wl,--gc-sections

SOURCES := $(wildcard $(SRC)/*.c)
OBJECTS := $(patsubst $(SRC)/%.c,$(BUILD)/%.o,$(SOURCES))

all: $(BUILD)/$(TARGET).elf

$(BUILD):
	mkdir -p $(BUILD)

$(BUILD)/%.o: $(SRC)/%.c | $(BUILD)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD)/$(TARGET).elf: $(OBJECTS)
	$(CC) $(LDFLAGS) $^ -o $@

clean:
	rm -rf $(BUILD)

.PHONY: all clean
`,
      },
      { path: '.gitignore', content: 'build/\n*.elf\n*.o\n' },
    ],
  },

  arduino: {
    info: {
      id: 'arduino',
      name: 'Arduino (PlatformIO)',
      description: 'Arduino 工程，PlatformIO 构建（支持 Uno/Nano/ESP32 等板卡）',
      buildHint: 'pio run 编译，pio run -t upload 烧录，pio device monitor 查看串口',
    },
    defaultAiFiles: ['src/main.cpp', 'include/config.h'],
    skeleton: [
      {
        path: 'platformio.ini',
        content: `; {{PROJECT_NAME}} - PlatformIO project
[env:default]
platform = atmelavr
board = uno
framework = arduino
monitor_speed = 115200
build_flags =
    -D{{PROJECT_NAME_UPPER}}_VERSION=1
`,
      },
      { path: '.gitignore', content: '.pio/\n.vscode/\n' },
    ],
  },

  stm32: {
    info: {
      id: 'stm32',
      name: 'STM32 (HAL, GCC)',
      description: 'STM32 工程，STM32Cube HAL + arm-none-eabi-gcc + Makefile',
      buildHint:
        '需要 arm-none-eabi-gcc。先按目标芯片在 Makefile 中设置 MCU 型号，make 编译，st-flash write build/*.bin 0x08000000 烧录',
    },
    defaultAiFiles: ['Core/Src/main.c', 'Core/Inc/main.h', 'Core/Src/app.c'],
    skeleton: [
      {
        path: 'Makefile',
        content: `# {{PROJECT_NAME}} - STM32 (HAL)
# 根据目标芯片调整 MCU（如 stm32f103c8tx / stm32f411vetx）
MCU     = stm32f103c8tx
TARGET  = {{PROJECT_NAME}}
BUILD   = build

CC      = arm-none-eabi-gcc
OBJCOPY = arm-none-eabi-objcopy
SIZE    = arm-none-eabi-size

CFLAGS  = -mcpu=cortex-m3 -mthumb -std=c11 -Os ${GCC_WARNING_FLAGS}
CFLAGS += -DSTM32F103xB -DUSE_HAL_DRIVER

LDFLAGS = -T stm32_flash.ld -specs=nano.specs -Wl,--gc-sections

SOURCES := $(wildcard Core/Src/*.c)
OBJECTS := $(patsubst Core/Src/%.c,$(BUILD)/%.o,$(SOURCES))

all: $(BUILD)/$(TARGET).elf $(BUILD)/$(TARGET).bin
	$(SIZE) $(BUILD)/$(TARGET).elf

$(BUILD):
	mkdir -p $(BUILD)

$(BUILD)/%.o: Core/Src/%.c | $(BUILD)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD)/$(TARGET).elf: $(OBJECTS)
	$(CC) $(LDFLAGS) $^ -o $@

$(BUILD)/$(TARGET).bin: $(BUILD)/$(TARGET).elf
	$(OBJCOPY) -O binary $< $@

flash: $(BUILD)/$(TARGET).bin
	st-flash write $< 0x08000000

clean:
	rm -rf $(BUILD)

.PHONY: all flash clean
`,
      },
      {
        path: 'stm32_flash.ld',
        content: `/* Simplified linker script for STM32F103C8 (64KB flash / 20KB RAM).
   For other chips, use the linker script from STM32CubeMX instead. */
MEMORY
{
  FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 64K
  RAM (rwx)  : ORIGIN = 0x20000000, LENGTH = 20K
}

_estack = ORIGIN(RAM) + LENGTH(RAM);

SECTIONS
{
  .isr_vector : { KEEP(*(.isr_vector)) } > FLASH
  .text       : { *(.text*) *(.rodata*) } > FLASH
  .data : {
    _sdata = .;
    *(.data*)
    _edata = .;
  } > RAM AT > FLASH
  _sidata = LOADADDR(.data);
  .bss (NOLOAD) : {
    _sbss = .;
    *(.bss*)
    _ebss = .;
  } > RAM
}
`,
      },
      { path: '.gitignore', content: 'build/\n*.elf\n*.bin\n*.o\n' },
    ],
  },

  esp32: {
    info: {
      id: 'esp32',
      name: 'ESP32 (ESP-IDF)',
      description: 'ESP32 工程，ESP-IDF + CMake 构建',
      buildHint:
        '安装 ESP-IDF 后运行 idf.py build，idf.py -p /dev/ttyUSB0 flash 烧录，idf.py monitor 查看日志',
    },
    defaultAiFiles: ['main/main.c', 'main/app.c', 'main/include/app_config.h'],
    skeleton: [
      {
        path: 'CMakeLists.txt',
        content: `# {{PROJECT_NAME}} - ESP-IDF project
cmake_minimum_required(VERSION 3.16)

include($ENV{IDF_PATH}/tools/cmake/project.cmake)
project({{PROJECT_NAME}})
`,
      },
      {
        path: 'main/CMakeLists.txt',
        content: `idf_component_register(
    SRCS "main.c" "app.c"
    INCLUDE_DIRS "include"
)
`,
      },
      {
        path: 'sdkconfig.defaults',
        content: `# {{PROJECT_NAME}} defaults
CONFIG_IDF_TARGET="esp32"
CONFIG_LOG_DEFAULT_LEVEL_INFO=y
`,
      },
      { path: '.gitignore', content: 'build/\nsdkconfig\nmanaged_components/\n' },
    ],
  },

  pico: {
    info: {
      id: 'pico',
      name: 'Raspberry Pi Pico (Pico SDK)',
      description: 'RP2040/RP2350 树莓派 Pico，Pico SDK + CMake 构建',
      buildHint:
        '安装 Raspberry Pi Pico SDK 后：mkdir build && cd build && cmake .. && make；将生成的 .uf2 拖入开发板（BOOTSEL 模式）或使用 openocd 烧录',
    },
    defaultAiFiles: ['src/main.c', 'src/app.c', 'include/config.h'],
    skeleton: [
      {
        path: 'CMakeLists.txt',
        content: `# {{PROJECT_NAME}} - Raspberry Pi Pico SDK
cmake_minimum_required(VERSION 3.13)

# 初始化 Pico SDK（请设置 PICO_SDK_PATH 环境变量）
include($ENV{PICO_SDK_PATH}/external/pico_sdk_import.cmake)

project({{PROJECT_NAME}} C CXX ASM)
set(CMAKE_C_STANDARD 11)

pico_sdk_init()

add_executable({{PROJECT_NAME}}
    src/main.c
    src/app.c
)

target_include_directories({{PROJECT_NAME}} PRIVATE include)
target_link_libraries({{PROJECT_NAME}} pico_stdlib hardware_i2c hardware_spi hardware_uart)

pico_add_extra_outputs({{PROJECT_NAME}})
`,
      },
      { path: '.gitignore', content: 'build/\n*.uf2\n*.elf\n*.o\n' },
    ],
  },

  avr: {
    info: {
      id: 'avr',
      name: 'AVR bare-metal (avr-gcc)',
      description: 'ATmega 系列 8 位 AVR 单片机，avr-gcc + Makefile',
      buildHint:
        '需要 avr-gcc 工具链与 avrdude。在 Makefile 中设置 MCU（如 atmega328p）和烧录器，make 编译，make flash 烧录',
    },
    defaultAiFiles: ['src/main.c', 'src/app.c', 'include/config.h'],
    skeleton: [
      {
        path: 'Makefile',
        content: `# {{PROJECT_NAME}} - AVR bare-metal
# 根据目标芯片调整 MCU（atmega328p / atmega2560 / attiny85 ...）
MCU      = atmega328p
F_CPU    = 16000000UL
TARGET   = {{PROJECT_NAME}}
BUILD    = build
PORT     ?= /dev/ttyUSB0
PROGRAMMER ?= arduino
BAUD     ?= 115200

CC       = avr-gcc
OBJCOPY  = avr-objcopy
AVRSIZE  = avr-size

CFLAGS   = -mmcu=$(MCU) -DF_CPU=$(F_CPU) -Os ${GCC_WARNING_FLAGS} -Iinclude
LDFLAGS  = -mmcu=$(MCU) -Wl,--gc-sections

SOURCES := $(wildcard src/*.c)
OBJECTS := $(patsubst src/%.c,$(BUILD)/%.o,$(SOURCES))

all: $(BUILD)/$(TARGET).hex
	$(AVRSIZE) --mcu=$(MCU) -C $(BUILD)/$(TARGET).elf

$(BUILD):
	mkdir -p $(BUILD)

$(BUILD)/%.o: src/%.c | $(BUILD)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD)/$(TARGET).elf: $(OBJECTS)
	$(CC) $(LDFLAGS) $^ -o $@

$(BUILD)/$(TARGET).hex: $(BUILD)/$(TARGET).elf
	$(OBJCOPY) -O ihex -R .eeprom $< $@

flash: $(BUILD)/$(TARGET).hex
	avrdude -p $(MCU) -c $(PROGRAMMER) -P $(PORT) -b $(BAUD) -U flash:w:$<:i

clean:
	rm -rf $(BUILD)

.PHONY: all flash clean
`,
      },
      { path: '.gitignore', content: 'build/\n*.hex\n*.elf\n*.o\n' },
    ],
  },

  micropython: {
    info: {
      id: 'micropython',
      name: 'MicroPython',
      description: 'MicroPython 工程（ESP32/Pico/STM32 等支持 MicroPython 的板卡），无需交叉编译',
      buildHint:
        '先给开发板刷入对应 MicroPython 固件，再用 mpremote cp main.py :main.py 或 Thonny 上传脚本；上电后自动运行 main.py',
    },
    defaultAiFiles: ['main.py', 'boot.py', 'config.py'],
    skeleton: [
      {
        path: '.gitignore',
        content: '__pycache__/\n*.pyc\n*.mpy\n.venv/\n',
      },
      {
        path: 'mpremote.md',
        content: `# {{PROJECT_NAME}} - MicroPython 部署说明

## 上传脚本到开发板

\`\`\`bash
# 安装 mpremote
pip install mpremote

# 连接开发板并上传全部脚本
mpremote connect auto fs cp main.py :main.py
mpremote connect auto fs cp boot.py :boot.py
mpremote connect auto fs cp config.py :config.py

# 进入 REPL
mpremote connect auto repl
\`\`\`

- boot.py：上电最先执行（仅放底层初始化）
- main.py：主程序入口
- config.py：引脚与参数配置
`,
      },
    ],
  },

  zephyr: {
    info: {
      id: 'zephyr',
      name: 'Zephyr RTOS',
      description: 'Zephyr 实时操作系统工程，west + CMake 构建，支持大量开发板',
      buildHint:
        '安装 Zephyr SDK 与 west 工具链：west build -b <board_name>（如 nucleo_f103rb / esp32_devkitc_wroom），west flash 烧录，west build -t menuconfig 配置',
    },
    defaultAiFiles: ['src/main.c', 'src/app.c', 'include/config.h'],
    skeleton: [
      {
        path: 'CMakeLists.txt',
        content: `# {{PROJECT_NAME}} - Zephyr RTOS application
cmake_minimum_required(VERSION 3.20)

find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})
project({{PROJECT_NAME}})

target_include_directories(app PRIVATE include)
target_sources(app PRIVATE
    src/main.c
    src/app.c
)
`,
      },
      {
        path: 'prj.conf',
        content: `# {{PROJECT_NAME}} - Zephyr 默认配置（Kconfig）
CONFIG_MAIN_STACK_SIZE=2048
CONFIG_SERIAL=y
CONFIG_CONSOLE=y
CONFIG_GPIO=y
# 需要 I2C / SPI 时打开：
# CONFIG_I2C=y
# CONFIG_SPI=y
`,
      },
      { path: '.gitignore', content: 'build/\n*.elf\n*.hex\n*.bin\n' },
    ],
  },
};

export const PLATFORM_LIST: PlatformInfo[] = Object.values(PLATFORM_TEMPLATES).map((t) => t.info);

export function getPlatform(id: string): PlatformTemplate | undefined {
  return PLATFORM_TEMPLATES[id as PlatformId];
}
