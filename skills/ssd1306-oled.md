---
name: ssd1306-oled
description: SSD1306/SH1106 OLED 显示驱动要点（初始化序列、显存刷新、中文字库）
triggers: oled, ssd1306, sh1106, 显示屏, 屏幕, u8g2
---

# SSD1306 OLED 驱动要点

## 初始化序列
- 上电后等待 **≥100ms** 再发初始化（VDD/VBAT 稳定），初始化命令序列必须完整（display off → 时钟设置 → 复用率/COM 扫描方向 → charge pump 使能 0x14 → display on），漏 charge pump 是"屏幕不亮"第一大原因。
- I2C 地址 0x3C（SA0=0）或 0x3D，注意左移一位；SH1106 与 SSD1306 初始化命令兼容但页寻址偏移 2 列，图像整体偏移多半是型号认错。

## 显存与刷新模型
- 128×64 = 1KB 显存（GDDRAM 页结构：8 页 × 128 字节，每字节纵向 8 点）。
- 双缓冲：RAM 里维护 framebuffer，`oled_flush()` 一次性 DMA 刷出；逐字节直接刷 I2C 会闪烁且慢（128×64 全刷 ≈1KB @400kHz ≈ 25ms）。
- 取模：ASCII 8×16 / 6×12 常用字库放 const flash；中文字库按需取模，放 flash 注意容量（每汉字 32B 起步）。

## 工程规范
- 显示驱动与业务分离：业务层调 `oled_draw_string(x,y,str)`，不碰显存细节。
- 刷新节流：数据变化才刷（脏标记），10Hz 足够人眼，省总线占用给传感器。
- I2C 总线上 OLED 与传感器共存时注意地址冲突（0x3C 与常见传感器不冲突，但 MPU6050 0x68/DHT 无冲突需自查）。
- 亮度用对比度命令 0x81 调节；长期显示固定内容建议 dim 或周期滚动防烧屏（OLED 残影不可逆）。
