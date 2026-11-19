# {{PROJECT_NAME}} - STM32 (HAL + arm-none-eabi-gcc)
#
# 目标芯片：STM32F103C8T6（BluePill / 64KB Flash / 20KB SRAM）
# 换芯片时同步改这三处：MCU 系列、LDSCRIPT、C_DEFS 里的 STM32F103xB
#
#   make        编译，产出 build/{{PROJECT_NAME_SAFE}}.elf 与 .bin
#   make flash  用 st-flash 烧录（需 ST-Link）
#   make clean  清理编译产物

TARGET   = {{PROJECT_NAME_SAFE}}
BUILD    = build
MCU      = cortex-m3
LDSCRIPT = STM32F103C8Tx_FLASH.ld

CC       = arm-none-eabi-gcc
AS       = arm-none-eabi-gcc -x assembler-with-cpp
OBJCOPY  = arm-none-eabi-objcopy
SIZE     = arm-none-eabi-size

C_DEFS   = -DUSE_HAL_DRIVER -DSTM32F103xB

C_INCLUDES = \
  -ICore/Inc \
  -IDrivers/STM32F1xx_HAL_Driver/Inc \
  -IDrivers/CMSIS/Device/ST/STM32F1xx/Include \
  -IDrivers/CMSIS/Include \
  -IDrivers/BSP

CFLAGS   = -mcpu=$(MCU) -mthumb -std=c11 -Os -g3 -Wall -Wextra \
           -ffunction-sections -fdata-sections $(C_DEFS) $(C_INCLUDES)
ASFLAGS  = -mcpu=$(MCU) -mthumb -g3
LDFLAGS  = -mcpu=$(MCU) -mthumb -T$(LDSCRIPT) -specs=nano.specs -specs=nosys.specs \
           -Wl,--gc-sections -Wl,-Map=$(BUILD)/$(TARGET).map

# 应用层 + 外设驱动 + 工程自带的 HAL 源文件
C_SOURCES   = $(wildcard Core/Src/*.c) \
              $(wildcard Drivers/BSP/*.c) \
              $(wildcard Drivers/STM32F1xx_HAL_Driver/Src/*.c)
ASM_SOURCES = startup_stm32f103xb.s

# 目标文件统一平铺到 build/obj/，vpath 负责回溯源文件所在目录
OBJECTS  = $(addprefix $(BUILD)/obj/, $(notdir $(C_SOURCES:.c=.o)))
OBJECTS += $(addprefix $(BUILD)/obj/, $(notdir $(ASM_SOURCES:.s=.o)))
vpath %.c $(sort $(dir $(C_SOURCES)))
vpath %.s $(sort $(dir $(ASM_SOURCES)))

all: $(BUILD)/$(TARGET).elf $(BUILD)/$(TARGET).bin
	$(SIZE) $(BUILD)/$(TARGET).elf

$(BUILD)/obj/%.o: %.c | $(BUILD)/obj
	$(CC) -c $(CFLAGS) $< -o $@

$(BUILD)/obj/%.o: %.s | $(BUILD)/obj
	$(AS) -c $(ASFLAGS) $< -o $@

$(BUILD)/$(TARGET).elf: $(OBJECTS)
	$(CC) $(LDFLAGS) $^ -o $@

$(BUILD)/$(TARGET).bin: $(BUILD)/$(TARGET).elf
	$(OBJCOPY) -O binary -S $< $@

$(BUILD)/obj:
	mkdir -p $(BUILD)/obj

flash: $(BUILD)/$(TARGET).bin
	st-flash write $< 0x08000000

clean:
	rm -rf $(BUILD)

.PHONY: all flash clean
