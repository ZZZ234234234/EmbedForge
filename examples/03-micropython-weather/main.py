"""main.py - 03-micropython-weather
DHT11 温湿度采集 + SSD1306 OLED 显示（EmbedForge 生成示例）。

依赖：
  - dht：MicroPython ESP32/Pico 固件自带
  - ssd1306：需将官方 ssd1306.py 一并上传到开发板
    https://github.com/micropython/micropython-lib/blob/master/micropython/drivers/display/ssd1306/ssd1306.py
"""
import time
import dht
import machine
from machine import Pin, I2C

import config


def build_sensor():
    pin = Pin(config.DHT_PIN)
    if config.DHT_TYPE == "DHT22":
        return dht.DHT22(pin)
    return dht.DHT11(pin)


def build_oled():
    import ssd1306
    i2c = I2C(0, scl=Pin(config.I2C_SCL_PIN), sda=Pin(config.I2C_SDA_PIN), freq=400_000)
    return ssd1306.SSD1306_I2C(config.OLED_WIDTH, config.OLED_HEIGHT, i2c, addr=config.OLED_ADDR)


def main():
    sensor = build_sensor()
    oled = build_oled()

    oled.fill(0)
    oled.text("EmbedForge", 0, 0)
    oled.text("Weather Station", 0, 12)
    oled.show()

    while True:
        try:
            sensor.measure()
            temp = sensor.temperature()
            hum = sensor.humidity()

            oled.fill(0)
            oled.text("EmbedForge", 0, 0)
            oled.text("T: {:.1f} C".format(temp), 0, 24)
            oled.text("H: {:.1f} %".format(hum), 0, 40)
            oled.show()

            print("[weather] T={:.1f}C H={:.1f}%".format(temp, hum))
        except OSError as exc:
            # DHT 偶发读取失败，下轮重试
            print("[weather] sensor error:", exc)
            oled.fill(0)
            oled.text("Sensor error", 0, 0)
            oled.text("retrying...", 0, 12)
            oled.show()

        time.sleep(config.SAMPLE_INTERVAL_S)


main()
