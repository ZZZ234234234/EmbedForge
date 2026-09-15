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
};

export const PLATFORM_LIST: PlatformInfo[] = Object.values(PLATFORM_TEMPLATES).map((t) => t.info);

export function getPlatform(id: string): PlatformTemplate | undefined {
  return PLATFORM_TEMPLATES[id as PlatformId];
}
