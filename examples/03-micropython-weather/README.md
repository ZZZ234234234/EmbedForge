# 03 · MicroPython 温湿度显示站

> EmbedForge 生成结果示例（平台：MicroPython，无需交叉编译）

## 原始需求（一句话）

> ESP32 用 MicroPython 读取 DHT11 温湿度，SSD1306 OLED 实时显示，每 2 秒刷新，读取失败自动重试。

## 用 EmbedForge 复现

```bash
embedforge generate "ESP32 用 MicroPython 读取 DHT11，SSD1306 OLED 显示温湿度，每 2 秒刷新" \
  --platform micropython --out ./03-micropython-weather
```

## 引脚（ESP32 DevKitC）

| GPIO | 信号 | 说明 |
| --- | --- | --- |
| GPIO4 | DHT11_DATA | 外接 4.7kΩ 上拉 |
| GPIO22 / GPIO21 | I2C SCL / SDA | SSD1306 OLED |

## 文件

```text
boot.py     上电底层初始化（含可选 WiFi 注释）
main.py     主程序：采集 + 显示 + 异常重试
config.py   引脚与采样参数配置
```

## 部署

```bash
pip install mpremote

# 1) 先给开发板刷入对应 MicroPython 固件
# 2) 上传驱动与脚本（ssd1306.py 需自行下载，见 main.py 顶部注释）
mpremote connect auto fs cp ssd1306.py :ssd1306.py
mpremote connect auto fs cp config.py :config.py
mpremote connect auto fs cp boot.py :boot.py
mpremote connect auto fs cp main.py :main.py

# 进入 REPL 查看日志
mpremote connect auto repl
```

上电后自动运行 `main.py`。
