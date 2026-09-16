# stm32f103-dht11-oled

> STM32F103 DHT11 OLED

## 项目信息

- 平台：STM32 (HAL, GCC)
- 目标芯片/开发板：未指定
- 构建系统：make

## 目录结构

```text
└─ .gitignore
└─ Makefile
└─ stm32_flash.ld
```

## 构建与烧录

需要 arm-none-eabi-gcc。先按目标芯片在 Makefile 中设置 MCU 型号，make 编译，st-flash write build/*.bin 0x08000000 烧录
