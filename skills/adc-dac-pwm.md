---
name: adc-dac-pwm
description: ADC 采集、DAC 输出与 PWM 生成要点（采样时间、滤波、分辨率、占空比计算）
triggers: adc, dac, pwm, 采样, 定时器, tim, 占空比, 电压
---

# ADC / DAC / PWM 开发要点

## ADC
- **采样时间与输入阻抗匹配**：高阻信号源（电位器>10kΩ、光敏）必须加长采样周期（如 239.5/640.5 cycles），否则读数偏低且跳变。
- 12 位 ADC 读数滤波：均值滤波（16 次平均）+ 中位值去毛刺；电源纹波大的板子加 RC 前置滤波（1k + 100nF）。
- 参考电压：VDDA 必须干净（独立 LDO 或磁珠+多电容），`VREFINT` 内部基准可做现场校准：`VDDA = 1.21V * 4096 / raw_vrefint`。
- 校准：F1 系列上电后必须执行 `ADC_ResetCalibration + ADC_StartCalibration`，不校准误差能到几个 LSB。
- 多通道扫描用 DMA 循环模式，别在轮询里反复切换通道（SQR 顺序 + 等待 EOC 极易错）。

## PWM
- 频率与占空比：`ARR` 定周期、`CCR` 定占空比，`f_pwm = f_clk / ((PSC+1)*(ARR+1))`。先算清楚定时器时钟（APB 倍频关系：APB 分频≠1 时 TIM 时钟 ×2）。
- 电机/舵机/LED 调光的频率差异：舵机 50Hz（0.5~2.5ms 脉宽）、电机 20kHz（避开人耳）、LED 调光 >200Hz 防频闪。
- 改占空比写 CCR 即可（影子寄存器下一周期生效）；改频率先停 PWM 或一起改 ARR+CCR，否则出毛刺。
- 互补输出带死区（H 桥/半桥）必须配 `BDTR` 死区时间，直通短路是烧管第一原因。

## DAC
- 输出缓冲使能（OutputBuffer）视负载决定；带载能力弱，驱动低阻要加运放跟随。
- 波形输出用 DMA + 定时器触发，别在中断里逐点写。
