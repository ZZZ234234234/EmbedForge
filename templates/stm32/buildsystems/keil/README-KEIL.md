# {{PROJECT_NAME}} · Keil MDK 使用须知

本目录的 Keil 工程由 EmbedForge 生成，`<工程名>.uvprojx` 已经配好 Core、HAL、Startup 三个分组，
可以直接打开。**只剩 BSP 驱动需要你手动加**（原因见第 1 节，不是配置错误）。

## 1. BSP 驱动源码要手动加进工程

外设驱动（`dht11.c` / `ssd1306.c` / `button.c` / `led_pwm.c` / `uart_debug.c`）由生成器按需求
放在 `Drivers/BSP/` 下，但**不同需求用到的驱动不同**，生成器不知道你的 `app.c` 会 include 哪个，
所以 BSP 组故意留空，避免把没用到的驱动也编进去（那会拖进额外的 HAL 模块、白占 Flash）。

做法：右键 `BSP` 组 → Add Existing Files to Group 'BSP' → 选中 `Drivers\BSP\` 下**实际用到**的 `.c`。
只加 `.c`，`.h` 靠 Include Paths 就能找到。

## 2. 启动文件已内置，不需要额外操作

根目录的 `startup_stm32f103xb_arm.s` 是 **ARM 汇编语法**（MDK-ARM 工具链版本），已加入 `Startup` 组，
Keil 可直接汇编。

注意区别：同目录还有一份 `startup_stm32f103xb.s`，那是**给 arm-none-eabi-gcc 用的 GNU 语法版**，
两者文件名相近但语法完全不同。**不要**把 GNU 那份加进 Keil 工程，否则会报大量语法错误。

## 3. 编译前确认

- **器件包**：`Options for Target` → `Device` 已设为 `STM32F103C8`，`Pack` 指向
  `Keil.STM32F1xx_DFP.2.3.0`。若你本机没装这个版本的 DFP，Keil 会提示找不到器件，
  用 Pack Installer 安装 STM32F1 系列 DFP 即可（2.3.0 或更新的 2.x 都兼容）。
- **散列文件**：`Linker` 页已勾选 `Use Memory Layout from Target Dialog` 之外的
  **Scatter File**，指向 `.<工程名>.sct`。这个文件把中断向量表固定在 `0x08000000`
  （`RESET, +First`）。**不要清空它**——没有散列文件时，armlink 会把启动代码排在
  向量表前面，芯片上电取到的是 `BL` 指令而不是初始 SP，表现为完全不起振。
- **C99**：`C/C++` 页的 `C99 Mode` 已勾选。BSP 驱动用了 `for (int i = 0; ...)`，
  AC5 默认 C90 会报 `#29: expected an expression`。
- **Include Paths**：`C/C++` 页已预置 5 条，缺一条都会报 `stm32f1xx_hal.h: No such file`。
- **Xtal**：`Target` 页默认 `12.0 MHz`。若你的板子是 8MHz 晶振（BluePill 常见），
  这只影响 Keil 软件仿真的计时，不影响实际烧录运行；真正决定主频的是 `Core/Src/main.c` 里的 PLL 配置
  （模板按 HSE=8MHz → 72MHz 配置）。
- **输出目录**：`.\build\`，与 Makefile / CMake 版本一致。

## 4. 与另外三种构建系统的关系

同一份工程可以同时存在 `Makefile`、`CMakeLists.txt`、`platformio.ini`。
它们互不干扰，但**不要混用中间产物**：这四个构建系统都输出到 `build\`，
切换构建系统前先删掉 `build\` 目录，避免链接到上一套工具链留下的 `.o`。

## 5. 换芯片

改三处：
1. `Options for Target` → `Device` 选新芯片
2. `C/C++` → `Define` 里的 `STM32F103xB` 改成对应宏（如 `STM32F103xE`）
3. 根目录换成对应型号的 `.s` 启动文件与 `.ld` 链接脚本（Keil 用 `.s`，不用 `.ld`）
