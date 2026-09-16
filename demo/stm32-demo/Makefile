# stm32f103-dht11-oled - STM32 (HAL)
# 根据目标芯片调整 MCU（如 stm32f103c8tx / stm32f411vetx）
MCU     = stm32f103c8tx
TARGET  = stm32f103-dht11-oled
BUILD   = build

CC      = arm-none-eabi-gcc
OBJCOPY = arm-none-eabi-objcopy
SIZE    = arm-none-eabi-size

CFLAGS  = -mcpu=cortex-m3 -mthumb -std=c11 -Os -Wall -Wextra -Werror=return-type -ffunction-sections -fdata-sections -Wl,--gc-sections
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
