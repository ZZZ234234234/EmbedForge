# test - generic bare-metal C
CC      ?= gcc
TARGET  ?= test
BUILD   = build
SRC     = src
INC     = include

CFLAGS  = -std=c11 -Os -Wall -Wextra -Werror=return-type -ffunction-sections -fdata-sections -Wl,--gc-sections -I$(INC)
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
