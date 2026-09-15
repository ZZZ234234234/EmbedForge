"""config.py - 03-micropython-weather
引脚与采样参数配置（EmbedForge 生成示例）。
"""

# ---- DHT11 温湿度传感器 ----
DHT_PIN = 4            # ESP32 DevKitC: GPIO4
DHT_TYPE = "DHT11"     # 可选 "DHT11" / "DHT22"

# ---- SSD1306 OLED（硬件 I2C） ----
I2C_SCL_PIN = 22       # ESP32 默认 I2C0 SCL
I2C_SDA_PIN = 21       # ESP32 默认 I2C0 SDA
OLED_WIDTH = 128
OLED_HEIGHT = 64
OLED_ADDR = 0x3C

# ---- 采样间隔（秒） ----
SAMPLE_INTERVAL_S = 2
