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
- **Agent 式多步流程**：LLM 先解析需求输出结构化规划（平台 / 芯片 / 功能模块 / 引脚分配 / 文件清单），再逐个生成源码文件
- **内置 4 个平台模板**：STM32 (HAL+GCC) / ESP32 (ESP-IDF) / Arduino (PlatformIO) / 通用裸机 C
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

## 🧩 支持的平台

| 平台 ID | 名称 | 构建系统 |
| --- | --- | --- |
| `stm32` | STM32 (HAL, GCC) | Makefile + arm-none-eabi-gcc |
| `esp32` | ESP32 (ESP-IDF) | CMake + idf.py |
| `arduino` | Arduino (PlatformIO) | platformio.ini + pio |
| `generic-c` | 通用裸机 C | Makefile |

## 🔧 接入任意 API

EmbedForge 使用 **OpenAI Chat Completions 兼容协议**，只需三个参数：

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `--provider` | 服务商预设 | `deepseek` / `openai` / `openrouter` / `ollama` |
| `--base-url` | API 端点 | `https://api.deepseek.com/v1` |
| `--model` | 模型名 | `deepseek-chat` / `gpt-4o-mini` / `qwen2.5:7b` |

> API Key 可通过 `--api-key` 或环境变量 `EMBEDFORGE_API_KEY` 提供，**不会写入任何文件**。

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

- [ ] 支持 Keil MDK / IAR 工程模板
- [ ] AI 生成代码的编译冒烟测试（GitHub Actions 内置工具链）
- [ ] 工程模板插件机制（用户自定义平台）
- [ ] 增量生成：在已有工程上添加功能

## 📜 License

[MIT](LICENSE) © 2026 ZZZ234234234

---

<a name="english"></a>

## English

**EmbedForge** is an **AI embedded development agent**. It connects to any OpenAI-compatible LLM API — you describe a requirement in one sentence, and it plans, generates, and assembles a complete, buildable embedded engineering project.

- Built-in platform templates: STM32 (HAL + GCC), ESP32 (ESP-IDF), Arduino (PlatformIO), generic bare-metal C
- Local-first: works with Ollama, data stays on your machine
- Offline skeleton mode: no API key needed to scaffold a project
- CLI + local Web UI (`embedforge web`)
- Any OpenAI-compatible endpoint (`--base-url` / `--model` / `--api-key` or `EMBEDFORGE_API_KEY`)

```bash
npm install && npm run build
node dist/cli/index.js generate "ESP32 WiFi temperature sensor with web page" --provider ollama --out ./esp32-sensor
node dist/cli/index.js web
```
