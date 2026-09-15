---
name: esp32-wifi
description: ESP32 WiFi/网络开发要点（ESP-IDF 事件模型、重连、HTTP/MQTT、功耗）
triggers: esp32, esp32s3, esp8266, wifi, mqtt, http, 联网, 网络
---

# ESP32 WiFi / 网络开发要点

## WiFi 连接模型（ESP-IDF）
- 标准流程：`nvs_flash_init()` → `esp_netif_init()` → `esp_event_loop_create_default()` → 注册 `WIFI_EVENT`/`IP_EVENT` 处理器 → `esp_wifi_start()`。
- **必须处理事件而不是轮询状态**：`WIFI_EVENT_STA_DISCONNECTED` 里重连（带退避：连续失败 N 次后重启 esp_wifi 或整体 reboot），`IP_EVENT_STA_GOT_IP` 才算就绪。
- NVS 初始化失败（`ERR_NVS_NO_FREE_PAGES`）要 `nvs_flash_erase()` 后重试。
- WiFi 参数（SSID/密码）放 NVS/KVS，别硬编码进固件；首次配网用 SmartConfig 或 SoftAP 模式。

## 应用层
- HTTP：`esp_http_client` 带超时（connect/network 都要设）；长任务放独立 task，回调里不要阻塞。
- MQTT：`esp_mqtt_client`，注册 `MQTT_EVENT_CONNECTED/DISCONNECTED` 管理 sub/resub；发布 QoS1 要等 `MQTT_EVENT_PUBLISHED`。
- TLS 时间戳：证书校验依赖系统时间，SNTP 先同步（`esp_sntp_init`），否则 TLS 全部握手失败。
- 内存：WiFi+TLS 场景堆紧张，大 buffer 用 `heap_caps_malloc(size, MALLOC_CAP_SPIRAM)`（有 PSRAM 的模组），盯 `esp_get_free_heap_size()`。

## 功耗与稳定性
- 电池供电：Modem-sleep（`esp_wifi_set_ps(WIFI_PS_MIN_MODEM)`）+ 深睡唤醒上传的"采样-上报-深睡"模型，深睡电流 ~10uA。
- 复位原因排查用 `esp_reset_reason()`；看门狗：长任务里喂 `esp_task_wdt_reset()`，否则 TASK_WDT 复位循环。
- 引脚注意：GPIO0/2/12/15 是 strapping 引脚，外设接这些脚可能导致无法启动；GPIO6~11 接内部 Flash 禁用。
