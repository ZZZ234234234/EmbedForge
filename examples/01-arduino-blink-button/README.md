# 01 · Arduino 按键控制 LED 闪烁

> EmbedForge 生成结果示例（平台：Arduino / PlatformIO）

## 原始需求（一句话）

> Arduino Uno 板载 LED 闪烁，每按一次按键在快闪/慢闪之间切换，串口打印当前状态。

## 用 EmbedForge 复现

```bash
embedforge generate "Arduino Uno 板载 LED 闪烁，D2 接按键切换快慢闪，串口输出状态" \
  --platform arduino --out ./01-arduino-blink-button
```

## 引脚

| 引脚 | 信号 | 说明 |
| --- | --- | --- |
| D13 | LED | 板载 LED |
| D2 | BUTTON | 按键到 GND，内部上拉 |

## 构建与烧录

```bash
pio run                 # 编译
pio run -t upload       # 烧录
pio device monitor      # 查看串口（115200）
```

## 文件

```text
platformio.ini      构建/板卡配置（模板骨架）
src/main.cpp        主程序（EmbedForge AI 生成）
```
