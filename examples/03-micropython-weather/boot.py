"""boot.py - 上电最先执行（EmbedForge 生成示例）。
只做最底层初始化，业务逻辑放在 main.py。
"""
import sys
import machine

print("[boot] MicroPython", sys.version)
print("[boot] CPU freq:", machine.freq() // 1_000_000, "MHz")

# 如需联网（例如后续上传数据），取消下面注释：
# import network
# wlan = network.WLAN(network.STA_IF)
# wlan.active(True)
# wlan.connect("YOUR_SSID", "YOUR_PASSWORD")
