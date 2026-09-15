---
name: freertos-rtos
description: FreeRTOS/RTOS 任务设计要点（优先级、队列、栈大小、临界区、看门狗）
triggers: freertos, rtos, 任务, queue, semaphore, 线程, cmsis, rt-thread
---

# FreeRTOS 任务设计要点

## 任务划分原则
- 按职能拆任务：采集（最高频）、通信（WiFi/串口）、UI（低频）、后台。**一个任务一个职责**，别写 500 行大循环。
- 优先级分配：硬实时（ISR 配合的采集）> 通信协议 > UI/日志；空闲任务优先级 0 不能被占用。
- 栈大小按最大调用深度 + printf/mbedtls 之类的深调用留余量：`uxTaskGetStackHighWaterMark()` 实测后 ×1.5 定值，别拍脑袋 128 字。

## 任务间通信选型
| 场景 | 机制 |
| --- | --- |
| 数据传递（传感器→处理） | Queue（带深度的拷贝语义，天然解耦） |
| 事件通知（ISR→任务） | `xTaskNotifyFromISR`（最轻量） |
| 资源互斥（I2C 总线、串口） | Mutex（带优先级继承） |
| 计数资源（缓冲池） | Counting Semaphore |
| 二值开关 | Event Group / Binary Semaphore |

- **ISR 里只能用 `FromISR` 版本 API**，且要检查 `pxHigherPriorityTaskWoken` 后 `portYIELD_FROM_ISR`。
- 互斥用 Mutex，不用二值信号量（无优先级继承会优先级反转）；优先级反转经典事故就是 BinSem 锁总线。

## 稳定性红线
1. 优先级继承只在 Mutex 生效；`xSemaphoreTake` 超时必须处理，不能无限等死等。
2. 所有任务循环里要有阻塞点（Queue 收取 / vTaskDelay），空转任务饿死低优先级任务。
3. 独立看门狗（IWDG）由监控任务喂：先确认各任务心跳标志再喂狗，单个任务卡死能被揪出来。
4. `configCHECK_FOR_STACK_OVERFLOW=2` + 栈溢出钩子打日志，内存类疑难杂症一抓一个准。
5. RTOS API 不是 ISR 安全的，包装宏 `configASSERT` + 严格模式（`configUSE_MALLOC_FAILED_HOOK`）在调试期全开。
