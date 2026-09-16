# {{PROJECT_NAME}} - STM32F103 (HAL + arm-none-eabi-gcc)
# 目标芯片：STM32F103C8T6（64KB Flash / 20KB RAM）
MCU     = stm32f103c8tx
TARGET  = {{PROJECT_NAME}}
BUILD   = build

CC      = arm-none-eabi-gcc
AS      = arm-none-eabi-gcc -x assembler-with-cpp
OBJCOPY = arm-none-eabi-objcopy
SIZE    = arm-none-eabi-size

CPU     = -mcpu=cortex-m3 -mthumb
CFLAGS  = $(CPU) -std=c11 -Os -Wall -Wextra -Werror=return-type -ffunction-sections -fdata-sections
CFLAGS += -DSTM32F103xB -DUSE_HAL_DRIVER
CFLAGS += -ICore/Inc
CFLAGS += -IDrivers/CMSIS/Include -IDrivers/CMSIS/Device/ST/STM32F1xx/Include
CFLAGS += -IDrivers/STM32F1xx_HAL_Driver/Inc
CFLAGS += -IDrivers/BSP

LDFLAGS = $(CPU) -T STM32F103C8Tx_FLASH.ld -specs=nano.specs -Wl,--gc-sections -Wl,-Map=$(BUILD)/$(TARGET).map

# 源文件：应用层 + HAL 库 + 外设驱动(BSP) + 启动汇编
C_SOURCES   := $(wildcard Core/Src/*.c)
C_SOURCES   += $(wildcard Drivers/STM32F1xx_HAL_Driver/Src/*.c)
C_SOURCES   += $(wildcard Drivers/BSP/*.c)
ASM_SOURCES := startup_stm32f103xb.s

OBJECTS  := $(addprefix $(BUILD)/,$(notdir $(C_SOURCES:.c=.o)))
OBJECTS  += $(addprefix $(BUILD)/,$(notdir $(ASM_SOURCES:.s=.o)))
vpath %.c $(sort $(dir $(C_SOURCES)))
vpath %.s $(sort $(dir $(ASM_SOURCES)))

all: $(BUILD)/$(TARGET).elf $(BUILD)/$(TARGET).bin
	$(SIZE) $<

$(BUILD):
	mkdir -p $@

$(BUILD)/%.o: %.c | $(BUILD)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD)/%.o: %.s | $(BUILD)
	$(AS) $(CPU) -c $< -o $@

$(BUILD)/$(TARGET).elf: $(OBJECTS)
	$(CC) $(LDFLAGS) $^ -o $@

$(BUILD)/$(TARGET).bin: $(BUILD)/$(TARGET).elf
	$(OBJCOPY) -O binary $< $@

flash: $(BUILD)/$(TARGET).bin
	st-flash write $< 0x08000000

clean:
	rm -rf $(BUILD)

.PHONY: all flash clean
