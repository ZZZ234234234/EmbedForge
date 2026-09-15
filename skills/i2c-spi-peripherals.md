---
name: i2c-spi-peripherals
description: I2C/SPI 外设驱动要点（时序、上拉、CS 管理、总线卡死恢复、器件 datasheet 对接）
triggers: i2c, spi, iic, 总线, eeprom, flash, w25q, mpu6050, 驱动
---

# I2C / SPI 外设驱动要点

## I2C
- **上拉必须存在**：4.7kΩ（100kHz）/ 2.2kΩ（400kHz），没有上拉总线读回全 0xFF 或卡死。
- 软件模拟 I2C 时序要满足器件 tHD;STA/tSU;STO 等参数，用数据手册值做延时，不要拍脑袋给 us。
- **总线卡死恢复**：从机拉死 SDA 时，主机手动发 9 个 SCL 时钟 + STOP 可解锁；HAL I2C 超时后要 `HAL_I2C_DeInit/ReInit`。
- 读寄存器流程：START → 写器件地址+W → 写寄存器地址 → Repeated START → 读。很多新人漏了 Repeated START 直接 STOP 再 START，部分器件会复位地址指针。
- 地址是 7 位左移一位的 8 位形式（如 0x68 → 0xD0 写 / 0xD1 读），HAL 直接传 `0x68<<1`。

## SPI
- **CPOL/CPHA 必须查器件手册 Mode0~3**，W25Q Flash 是 Mode0/Mode3 兼容，MPU6050 是 Mode0（高电平有效期间采样错数据表现为寄存器值错位）。
- CS 手动控制时：拉低 → 传输 → 拉高，**片选周期必须完整包住整个命令+数据**，多字节传输中途拉高会复位命令。
- 速率从低配起：先 1MHz 验证协议再往上调；长走线降低速率。
- DMA 收发时 TX 用 dummy byte 填充，RX 完成前不能提前拉高 CS。

## 通用规范
- 器件驱动分层：`xxx_bus.c`（总线收发抽象）+ `xxx_device.c`（器件寄存器逻辑）+ `xxx.h`（API），便于换平台移植。
- 所有寄存器读写带超时与错误码返回，不要 void 返回吞错误。
- 初值要按数据手册"上电默认值"表核对，部分器件上电需要 `sw_reset` 命令 + 5ms 等待。
