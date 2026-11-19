# 构建系统模板目录

每个平台一个子目录，子目录下按构建系统分：`<platform>/buildsystems/<system>/`。
这里放的文件会被 `getBuildFiles(platform, buildSystem)` 递归读取，按**相对工程根目录**的路径
写进生成工程，因此文件名与内容里的 `{{PROJECT_NAME_SAFE}}` 占位符会被替换成 ASCII 工程名。

## 目录为什么叫 buildsystems 而不是 build

`templates/stm32/.gitignore` 里的 `build/` 是用来忽略**生成工程**的编译产物的。
如果构建模板也放在 `templates/stm32/build/` 下，git 会连带把它们一起忽略
（`git check-ignore` 可直接验证），导致模板永远提交不进仓库。
改名成 `buildsystems/` 后两边互不影响。

## 占位符

| 占位符 | 值 | 用在哪 |
| --- | --- | --- |
| `{{PROJECT_NAME}}` | 原始工程名（可含中文） | 仅注释，给人看 |
| `{{PROJECT_NAME_SAFE}}` | ASCII 工程名（中文替换为连字符） | CMake target、Keil 工程名、产物文件名 |
| `{{PROJECT_NAME_SAFE_UPPER}}` | 上面的大写+下划线形式 | `-DXXX_VERSION=1` 这类宏名 |

**构建标识符一律用 `_SAFE`。** 中文工程名直接进 CMake target 会让 CMake 报
`Invalid target name`，进 `-D` 宏名会让编译器报语法错误。

## 当前覆盖情况

| 平台 | 构建系统 | 说明 |
| --- | --- | --- |
| stm32 | `make` / `cmake` / `keil` / `platformio` | 四种齐全，`make` 与 `cmake` 已实测编译通过 |
| esp32 / pico / zephyr | 骨架自带 `CMakeLists.txt` | 不支持切换，`supportedBuildSystems()` 返回空 |
| arduino | 骨架自带 `platformio.ini` | 同上 |
| avr / generic-c | 骨架自带 `Makefile` | 同上 |
| micropython | 无构建系统（脚本直传） | 同上 |

## 实测记录

| 构建系统 | 状态 | 验证环境 |
| --- | --- | --- |
| make | ✅ 编译通过，产物 2428 B | arm-none-eabi-gcc 13.3.1 + GNU Make 4.4.1 |
| cmake | ✅ 编译通过，产物 2428 B（与 make 一致） | CMake 3.30.5 + 同上工具链，`cmake --preset debug` |
| keil | ✅ 工具链跑通，产物 4672 B，向量表正确 | ARMCC 5.06u7 + armlink + fromelf（Keil MDK 5.35） |
| platformio | ⚠️ 未实编译 | 本机未安装 PlatformIO |

`make` 与 `cmake` 两条路径产出的 `.bin` 字节数完全相同，说明两套构建系统链接的是同一份
目标文件集合、同一个链接脚本。

Keil 侧的 4672 B 比 GCC 的 2428 B 大，属正常差异：ARMCC 与 GCC 的 C 库实现、优化策略不同，
且 Keil 版未开 `-O2`。两者向量表均正确（初始 SP 落在 SRAM、Reset_Handler 落在 Flash）。

## 关于 Keil

`startup_stm32f103xb_arm.s` 是从 STM32Cube F1 固件包取来的 **ARM 汇编语法**启动文件，
已加入 `.uvprojx` 的 Startup 组。根目录另有一份 `startup_stm32f103xb.s` 是 **GNU 语法**，
给 arm-none-eabi-gcc 用，两者不可混用。详见 `keil/README-KEIL.md`。

两处容易踩的 Keil 配置，模板已内置正确值：

- **`<useFile>1</useFile>` + `ScatterFile`**：不启用 scatter 文件时，armlink 会把
  `BL __scatterload` 排到 `0x08000000`，中断向量表被挤到后面，芯片上电取到的是 BL 指令
  而不是初始 SP，表现为不启动。模板已附 `.sct` 并强制 `RESET, +First`。
- **`<uC99>1</uC99>`**：AC5 默认 C90，而 BSP 驱动用了 `for (int i = 0; ...)` 这类
  C99 写法，不开启会报 `#29: expected an expression`。
