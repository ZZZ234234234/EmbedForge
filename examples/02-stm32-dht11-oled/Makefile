# dht11-oled - STM32 (HAL)
# MCU: STM32F103C8T6 (BluePill)
# 注意：本示例仅含应用层代码；完整编译还需 STM32Cube HAL Drivers 与启动文件，
#       可用 STM32CubeMX 生成同型号基础工程后，将 Core/Src、Core/Inc 替换为本示例文件。
MCU     = stm32f103c8tx
TARGET  = dht11-oled
BUILD   = build

CC      = arm-none-eabi-gcc
OBJCOPY = arm-none-eabi-objcopy
SIZE    = arm-none-eabi-size

CFLAGS  = -mcpu=cortex-m3 -mthumb -std=c11 -Os -Wall -Wextra -ffunction-sections -fdata-sections
CFLAGS += -DSTM32F103xB -DUSE_HAL_DRIVER -ICore/Inc -IDrivers/Inc

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
