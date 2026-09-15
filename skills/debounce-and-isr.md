---
name: debounce-and-isr
description: 按键消抖与中断服务程序安全规范（volatile、临界区、前后台队列）
triggers: 按键, 消抖, 中断, exti, isr, key, button, 临界区
---

# 按键消抖与中断安全规范

## 按键消抖
- 机械抖动 5~20ms。**绝不在 ISR 里 `HAL_Delay` 消抖**（阻塞整个中断系统）。
- 推荐两种成熟做法：
  1. **定时器采样**：10ms 周期读引脚，连续 N 次相同才确认状态变化（软件滤波，最稳）。
  2. **EXTI + 时间戳**：中断里记录 `HAL_GetTick()`，与上次触发间隔 <50ms 视为抖动丢弃。
- 长按/短按/连按用状态机（未按下→消抖确认→按下计时→长按判定→等待释放），不要用多层 if 硬写。

## ISR 安全规范（资深红线）
1. **与 ISR 共享的变量必须 `volatile`**，多字节变量（32 位以上结构体/u64）读写要临界区保护，否则读到撕裂值。
2. ISR 里只做三件事：取数据、置标志、入队。解析/打印/浮点运算全部放主循环。
3. 临界区用 `__disable_irq()/__enable_irq()` 或 `taskENTER_CRITICAL()`（RTOS），保护区间越短越好，微秒级。
4. ISR 中禁止调用非可重入函数（printf、malloc、带 __HAL_LOCK 的 HAL 发送函数）。
5. 多个中断有优先级依赖时显式配置 NVIC 抢占优先级，默认全 0 会被高频率中断饿死。
6. EXTI 共享中断线（如 PA0/PB0 共 EXTI0）一次只能一个引脚使能。

## 参考骨架
```c
/* ISR：只置标志 */
volatile uint8_t key_event = 0;
void EXTI0_IRQHandler(void) {
    if (__HAL_GPIO_EXTI_GET_IT(KEY_PIN)) {
        __HAL_GPIO_EXTI_CLEAR_IT(KEY_PIN);
        key_event = 1;               /* 主循环消抖+处理 */
    }
}
```
