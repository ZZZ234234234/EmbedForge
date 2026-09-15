/**
 * app.c - 02-stm32-dht11-oled
 * DHT11 单总线读取 + SSD1306 软件 I2C 驱动 + 主循环
 */
#include "main.h"
#include <stdio.h>
#include <string.h>

/* ================= DWT 微秒延时 ================= */
void DWT_Init(void)
{
  CoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;
  DWT->CYCCNT = 0;
  DWT->CTRL |= DWT_CTRL_CYCCNTENA_Msk;
}

void DWT_DelayUs(uint32_t us)
{
  const uint32_t start = DWT->CYCCNT;
  const uint32_t ticks = us * (SystemCoreClock / 1000000U);
  while ((DWT->CYCCNT - start) < ticks) { }
}

/* ================= DHT11 单总线 ================= */
static void dht11_output_low(void)  { HAL_GPIO_WritePin(DHT11_PORT, DHT11_PIN, GPIO_PIN_RESET); }
static void dht11_release(void)     { HAL_GPIO_WritePin(DHT11_PORT, DHT11_PIN, GPIO_PIN_SET); }
static uint8_t dht11_read(void)     { return HAL_GPIO_ReadPin(DHT11_PORT, DHT11_PIN); }

static int dht11_wait_level(uint8_t level, uint32_t timeoutUs)
{
  while (dht11_read() == level) {
    if (timeoutUs-- == 0) return -1;
    DWT_DelayUs(1);
  }
  return 0;
}

/**
 * 读取 DHT11，温湿度放大 10 倍返回（如 253 = 25.3°C）
 * @return 0 成功，负值为超时/校验错误
 */
static int dht11_read_raw(uint8_t data[5])
{
  memset(data, 0, 5);

  /* 主机起始信号：拉低 18ms 后释放 */
  dht11_output_low();
  HAL_Delay(20);
  dht11_release();
  DWT_DelayUs(30);

  /* DHT11 响应：80us 低 + 80us 高 */
  if (dht11_wait_level(1, 100) < 0) return -1;   /* 等变低 */
  if (dht11_wait_level(0, 100) < 0) return -2;   /* 等变高 */
  if (dht11_wait_level(1, 100) < 0) return -3;   /* 等数据位开始 */

  for (uint8_t i = 0; i < 40; i++) {
    /* 每位以约 50us 低电平开始 */
    if (dht11_wait_level(0, 80) < 0) return -4;
    if (dht11_wait_level(1, 80) < 0) return -5;

    /* 高电平持续时间：26~28us 为 0，约 70us 为 1 */
    DWT_DelayUs(40);
    data[i / 8] <<= 1;
    if (dht11_read() == 1) data[i / 8] |= 1;
    dht11_wait_level(0, 60); /* 等待本位结束 */
  }

  const uint8_t sum = data[0] + data[1] + data[2] + data[3];
  return (sum == data[4]) ? 0 : -6;
}

/* ================= 软件 I2C ================= */
static void scl_high(void) { HAL_GPIO_WritePin(OLED_I2C_PORT, OLED_SCL_PIN, GPIO_PIN_SET); }
static void scl_low(void)  { HAL_GPIO_WritePin(OLED_I2C_PORT, OLED_SCL_PIN, GPIO_PIN_RESET); }
static void sda_high(void) { HAL_GPIO_WritePin(OLED_I2C_PORT, OLED_SDA_PIN, GPIO_PIN_SET); }
static void sda_low(void)  { HAL_GPIO_WritePin(OLED_I2C_PORT, OLED_SDA_PIN, GPIO_PIN_RESET); }
static void i2c_delay(void){ DWT_DelayUs(2); }

static void i2c_start(void) { sda_high(); scl_high(); i2c_delay(); sda_low(); i2c_delay(); scl_low(); }
static void i2c_stop(void)  { sda_low(); scl_high(); i2c_delay(); sda_high(); i2c_delay(); }

static int i2c_write_byte(uint8_t b)
{
  for (uint8_t i = 0; i < 8; i++) {
    if (b & 0x80) sda_high(); else sda_low();
    i2c_delay(); scl_high(); i2c_delay(); scl_low();
    b <<= 1;
  }
  /* 第 9 个时钟：ACK（从机拉低 SDA，开漏模式下直接释放读取） */
  sda_high(); i2c_delay(); scl_high(); i2c_delay();
  const int ack = HAL_GPIO_ReadPin(OLED_I2C_PORT, OLED_SDA_PIN) == 0;
  scl_low();
  return ack;
}

/* ================= SSD1306（128x64） ================= */
static void oled_cmd(uint8_t cmd)
{
  i2c_start();
  i2c_write_byte(OLED_I2C_ADDR);
  i2c_write_byte(0x00); /* control byte: command */
  i2c_write_byte(cmd);
  i2c_stop();
}

static void oled_data(const uint8_t *buf, uint16_t len)
{
  i2c_start();
  i2c_write_byte(OLED_I2C_ADDR);
  i2c_write_byte(0x40); /* control byte: data */
  for (uint16_t i = 0; i < len; i++) i2c_write_byte(buf[i]);
  i2c_stop();
}

static void oled_pos(uint8_t page, uint8_t col)
{
  oled_cmd(0xB0 | page);
  oled_cmd(0x00 | (col & 0x0F));
  oled_cmd(0x10 | (col >> 4));
}

static void oled_clear(void)
{
  uint8_t blank[128];
  memset(blank, 0, sizeof(blank));
  for (uint8_t p = 0; p < 8; p++) {
    oled_pos(p, 0);
    oled_data(blank, 128);
  }
}

/* 精简 6x8 点阵：仅实现显示所需字符 */
static const uint8_t FONT6x8[][6] = {
  [' '] = {0,0,0,0,0,0},
  ['-'] = {0x08,0x08,0x08,0x08,0x08,0},
  ['.'] = {0,0,0x60,0x60,0,0},
  [':'] = {0,0x36,0x36,0,0,0},
  ['%'] = {0x63,0x13,0x08,0x04,0x63,0},
  ['C'] = {0x3E,0x51,0x49,0x45,0x3E,0},
  ['H'] = {0x7F,0x08,0x08,0x08,0x7F,0},
  ['T'] = {0x01,0x01,0x7F,0x01,0x01,0},
  ['0'] = {0x3E,0x51,0x49,0x45,0x3E,0},
  ['1'] = {0x00,0x42,0x7F,0x40,0x00,0},
  ['2'] = {0x42,0x61,0x51,0x49,0x46,0},
  ['3'] = {0x21,0x41,0x45,0x4B,0x31,0},
  ['4'] = {0x18,0x14,0x12,0x7F,0x10,0},
  ['5'] = {0x27,0x45,0x45,0x45,0x39,0},
  ['6'] = {0x3C,0x4A,0x49,0x49,0x30,0},
  ['7'] = {0x01,0x71,0x09,0x05,0x03,0},
  ['8'] = {0x36,0x49,0x49,0x49,0x36,0},
  ['9'] = {0x06,0x49,0x49,0x29,0x1E,0},
};

static void oled_str(uint8_t page, uint8_t col, const char *s)
{
  oled_pos(page, col);
  while (*s) {
    uint8_t ch = (uint8_t)*s++;
    const uint8_t *glyph = (ch < 128) ? FONT6x8[ch] : FONT6x8[' '];
    oled_data(glyph, 6);
  }
}

static void ssd1306_init(void)
{
  HAL_Delay(100);
  oled_cmd(0xAE); /* display off */
  oled_cmd(0x20); oled_cmd(0x02); /* page addressing */
  oled_cmd(0xB0);
  oled_cmd(0xC8); /* COM scan direction */
  oled_cmd(0x00); oled_cmd(0x10);
  oled_cmd(0x40);
  oled_cmd(0x81); oled_cmd(0x7F); /* contrast */
  oled_cmd(0xA1); /* segment remap */
  oled_cmd(0xA6); /* normal display */
  oled_cmd(0xA8); oled_cmd(0x3F); /* multiplex 1/64 */
  oled_cmd(0xD3); oled_cmd(0x00);
  oled_cmd(0xD5); oled_cmd(0x80);
  oled_cmd(0xD9); oled_cmd(0xF1);
  oled_cmd(0xDA); oled_cmd(0x12);
  oled_cmd(0xDB); oled_cmd(0x40);
  oled_cmd(0x8D); oled_cmd(0x14); /* charge pump */
  oled_cmd(0xAF); /* display on */
  oled_clear();
}

/* ================= 应用主循环 ================= */
void App_Run(void)
{
  ssd1306_init();
  oled_str(0, 0, "EMBEDFORGE");
  oled_str(2, 0, "DHT11 BOOT...");

  uint8_t frame[5];
  char line[24];

  while (1) {
    HAL_Delay(2000);

    if (dht11_read_raw(frame) == 0) {
      const uint16_t tempX10 = frame[2] * 10 + frame[3];
      const uint8_t hum = frame[0];

      snprintf(line, sizeof(line), "T:%lu.%lu C",
               (unsigned long)(tempX10 / 10), (unsigned long)(tempX10 % 10));
      oled_str(2, 0, "             ");
      oled_str(2, 0, line);

      snprintf(line, sizeof(line), "H:%u %%", hum);
      oled_str(4, 0, "             ");
      oled_str(4, 0, line);

      printf("[dht11] temp=%lu.%luC hum=%u%%\r\n",
             (unsigned long)(tempX10 / 10), (unsigned long)(tempX10 % 10), hum);
    } else {
      oled_str(2, 0, "DHT11 ERROR  ");
      printf("[dht11] read failed, retry next cycle\r\n");
    }
  }
}
