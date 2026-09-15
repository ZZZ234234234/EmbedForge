<div align="center">

# EmbedForge · 嵌入式 AI 开发 Agent

**Describe your requirement. Get a complete embedded engineering project.**

**描述需求，AI 自动生成完整嵌入式工程文件。**

[![License](https://img.shields.io/badge/license-MIT-b8ed78?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![CI](https://github.com/ZZZ234234234/EmbedForge/actions/workflows/ci.yml/badge.svg)](https://github.com/ZZZ234234234/EmbedForge/actions/workflows/ci.yml)

</div>

EmbedForge 是一个**嵌入式 AI 开发 Agent**：接入任意 OpenAI 兼容的 LLM API（DeepSeek / OpenAI / Ollama / OpenRouter…），你用一句话描述开发需求，它会自动完成 **需求解析 → 工程规划 → 代码生成 → 工程组装**，输出一个可直接编译的嵌入式工程目录。

**简体中文** · [English](#english)

---

## ✨ 特性

- **一句话生成工程**：`embedforge generate "STM32F103 读取 DHT11 温湿度，OLED 显示"`
- **上传附件 + 多模态**：可带入数据手册、已有代码（文本）和原理图、引脚图（图片）；图片按 vision 多模态发送，AI 直接"看懂"接线图
- **上下文记忆**：会话本地持久化，可在同一工程上多轮迭代（先建工程，再说"把 LED 改成 PWM 呼吸灯"），自动保持工程名、平台与引脚一致
- **Agent 式多步流程**：LLM 先解析需求输出结构化规划（平台 / 芯片 / 功能模块 / 引脚分配 / 文件清单），再逐个生成源码文件
- **内置 8 个平台模板**：STM32 (HAL+GCC) / ESP32 (ESP-IDF) / Arduino (PlatformIO) / 树莓派 Pico (Pico SDK) / AVR (avr-gcc) / MicroPython / Zephyr RTOS / 通用裸机 C
- **本地优先**：支持 Ollama 等本地模型，代码与数据不出本机
- **离线骨架模式**：`--skeleton-only` 无需 API Key，直接生成可扩展的工程骨架
- **双入口**：命令行 CLI + 本地 Web 界面（`embedforge web`）
- **OpenAI 兼容**：任意 `baseURL` + `model` + `apiKey` 即可接入

## 🚀 快速开始

```bash
# 安装依赖并构建
npm install
npm run build

# 查看支持的命令
node dist/cli/index.js --help

# 列出支持的平台
node dist/cli/index.js platforms
```

### 生成一个工程（需要 API Key）

```bash
# 方式一：命令行参数
node dist/cli/index.js generate "STM32F103C8T6 读取 DHT11 温湿度，I2C OLED 显示，串口打印" \
  --provider deepseek \
  --api-key sk-xxxx \
  --out ./my-project

# 方式二：环境变量
export EMBEDFORGE_API_KEY=sk-xxxx
export EMBEDFORGE_BASE_URL=https://api.deepseek.com/v1
export EMBEDFORGE_MODEL=deepseek-chat
node dist/cli/index.js generate "ESP32 做一个 WiFi 温湿度服务器"
```

### 离线骨架模式（无 API Key）

```bash
node dist/cli/index.js generate "DHT11 温湿度监测" --platform stm32 --skeleton-only --out ./dht11-demo
```

### Web 界面

```bash
node dist/cli/index.js web --port 7788
# 浏览器打开 http://127.0.0.1:7788
```

## 📂 示例工程（Examples）

[`examples/`](examples) 提供了三个完整的生成结果样例，可直接对照查看「一句话需求 → 完整工程」的产出：

- **Arduino**：LED 闪烁 + 按键消抖切换频率（PlatformIO）
- **STM32**：DHT11 单总线 + 软件 I2C 驱动 SSD1306 OLED + 串口（HAL + GCC）
- **MicroPython**：DHT11 + OLED 温湿度站，异常自动重试（无需交叉编译）

## 🧩 支持的平台

| 平台 ID | 名称 | 构建系统 |
| --- | --- | --- |
| `stm32` | STM32 (HAL, GCC) | Makefile + arm-none-eabi-gcc |
| `esp32` | ESP32 (ESP-IDF) | CMake + idf.py |
| `arduino` | Arduino (PlatformIO) | platformio.ini + pio |
| `pico` | 树莓派 Pico / RP2040 / RP2350 | Pico SDK + CMake |
| `avr` | AVR / ATmega 裸机 | avr-gcc + Makefile + avrdude |
| `micropython` | MicroPython（无需交叉编译） | 脚本直传（mpremote / Thonny） |
| `zephyr` | Zephyr RTOS | west + CMake |
| `generic-c` | 通用裸机 C | Makefile |

## 🔧 接入任意 API

EmbedForge 使用 **OpenAI Chat Completions 兼容协议**，只需三个参数：

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `--provider` | 服务商预设 | `deepseek` / `openai` / `openrouter` / `ollama` |
| `--base-url` | API 端点 | `https://api.deepseek.com/v1` |
| `--model` | 模型名 | `deepseek-chat` / `gpt-4o-mini` / `qwen2.5:7b` |

> API Key 可通过 `--api-key` 或环境变量 `EMBEDFORGE_API_KEY` 提供，**不会写入任何文件**。

## 📎 附件与上下文记忆

### 上传文件 / 图片（CLI）

`--attach` 可重复指定，文本类（`.c/.h/.py/.md/.txt/.ini/.json/…`）直接读入上下文，图片类（`.png/.jpg/.webp/.gif`）按多模态发送：

```bash
embedforge generate "按这份数据手册和原理图生成驱动" \
  --attach ./datasheet.md --attach ./schematic.png \
  --provider openai --model gpt-4o-mini
```

> 图片识别需要**多模态（视觉）模型**，如 `gpt-4o`、`qwen-vl`、`llava`；纯文本模型（如 deepseek-chat）无法读图，但文本附件照常生效。

### 多轮记忆（在同一工程上迭代）

每次生成会返回一个**会话 id**，用 `--session` 续接即可让 AI 记住之前的需求、工程结构和引脚约定：

```bash
# 第一轮，返回会话 id：s-xxxx
embedforge generate "STM32 点灯" --session ""
# 第二轮：在原工程基础上迭代
embedforge generate "再加一个按键中断控制亮度" --session s-xxxx
# 查看本地所有会话
embedforge sessions
```

会话保存在本地 `.embedforge/sessions/`（默认保留最近 10 轮），不上传云端。

### Web 界面上传

`embedforge web` 打开后，可直接多选文件/图片、查看缩略图、移除附件；页面顶部显示当前会话与轮次，点「开启新会话」清空上下文。

## 🧠 工作原理

```text
用户需求
   │
   ▼
┌──────────────┐   LLM 结构化输出   ┌──────────────────┐
│  需求解析     │ ─────────────────▶ │  工程规划 (JSON)  │
│  planProject │                    │ 平台/芯片/引脚/文件│
└──────────────┘                    └────────┬─────────┘
                                             ▼
┌─────────────────────────────────────────────────────┐
│  工程生成 generateProject                           │
│  ├─ 模板骨架：Makefile / platformio.ini / 链接脚本… │
│  └─ AI 源码：main.c / 驱动 / 头文件（并发生成）      │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│  工程组装 writeProject                               │
│  写入磁盘 + 生成工程 README（含引脚表/构建说明）      │
└─────────────────────────────────────────────────────┘
```

## 📁 生成的工程结构示例（stm32）

```text
my-project/
├── Makefile            # 模板骨架
├── stm32_flash.ld      # 模板骨架
├── .gitignore          # 模板骨架
├── README.md           # 自动生成（简介/引脚表/构建说明）
└── Core/
    ├── Inc/main.h      # AI 生成
    └── Src/main.c      # AI 生成
```

## 🗺️ Roadmap

- [x] 8 大平台模板：STM32 / ESP32 / Arduino / Pico / AVR / MicroPython / Zephyr / 通用 C
- [x] 附件上传（文本/代码 + 原理图图片多模态）与本地会话记忆、多轮迭代
- [ ] 支持 Keil MDK / IAR / STM32CubeIDE 工程模板
- [ ] FreeRTOS / RT-Thread 等 RTOS 选项
- [ ] AI 生成代码的编译冒烟测试（GitHub Actions 内置工具链）
- [ ] 工程模板插件机制（用户自定义平台）
- [ ] 基于已有工程目录的增量改写（当前为会话级记忆迭代）

## 🛡️ 官方身份、防伪与维权

- 本项目源代码遵循 [MIT License](LICENSE) 开放，但 **EmbedForge** 名称、Logo、作者署名与“官方版本”标识不得被第三方用于冒充官方发布；分发修改版须明确标注为第三方修改，边界详见 [TRADEMARKS.md](TRADEMARKS.md)
- 官方代码仓库：<https://github.com/ZZZ234234234/EmbedForge>，官方安装包仅通过本仓库 GitHub Releases 发布
- 发现删除版权或许可声明、伪造官方安装包、冒充官方发布渠道、盗用作者署名等情况，请保留页面链接、账号信息、截图、文件样本与发现时间后联系作者，作者保留通过平台投诉、侵权通知、下架申请等合法途径维权的权利

## 📮 联系方式

- 作者：爱吃孜然芥末（GitHub：ZZZ234234234），嘉兴大学通信专业学生独立制作，不代表学校官方开发、授权或背书
- 邮箱：<2014546082@qq.com>（使用问题、合作与疑似仿冒线索）

## 📜 License

[MIT](LICENSE) © 2026 ZZZ234234234（爱吃孜然芥末）

---

<a name="english"></a>

## English

**EmbedForge** is an **AI embedded development agent**. It connects to any OpenAI-compatible LLM API — you describe a requirement in one sentence, and it plans, generates, and assembles a complete, buildable embedded engineering project.

- Built-in platform templates: STM32 (HAL + GCC), ESP32 (ESP-IDF), Arduino (PlatformIO), Raspberry Pi Pico (Pico SDK), AVR (avr-gcc), MicroPython, Zephyr RTOS, generic bare-metal C
- Local-first: works with Ollama, data stays on your machine
- Attachments: feed in datasheets / existing code (text) and schematics / pinout images (vision multimodal)
- Session memory: iterate on the same project across turns (`--session <id>`), kept locally
- Offline skeleton mode: no API key needed to scaffold a project
- CLI + local Web UI (`embedforge web`)
- Any OpenAI-compatible endpoint (`--base-url` / `--model` / `--api-key` or `EMBEDFORGE_API_KEY`)

**Author:** 爱吃孜然芥末 (GitHub: ZZZ234234234), an independent student project. Contact: 2014546082@qq.com. Brand identity and anti-impersonation terms: see [TRADEMARKS.md](TRADEMARKS.md).

```bash
npm install && npm run build
node dist/cli/index.js generate "ESP32 WiFi temperature sensor with web page" --provider ollama --out ./esp32-sensor
node dist/cli/index.js web
```
