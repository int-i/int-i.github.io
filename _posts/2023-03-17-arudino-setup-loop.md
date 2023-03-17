---
title: "네모난 보드속에 피어난 How is the life? 아두이노 setup과 loop의 동작 원리"
date: 2023-03-17
author: Astro36
category: cpp
tags: [cpp, c, hardware, arduino, system_programming, embedded_system, main, setup, loop]
thumbnail: /assets/posts/2023-03-17-arudino-setup-loop/thumbnail.jpg
---

[Arduino](https://www.arduino.cc/)는 문법이 제한된 **C++ 언어**를 이용해 프로그래밍하며, 코드의 구성부는 크게 `setup` 함수와 `loop` 함수로 나뉘어 있습니다.

`setup`과 `loop`의 동작 **원리**를 알아보기 위해, [Arduino Core](https://github.com/arduino/ArduinoCore-sam) 코드를 **다운로드** 받아 `main` 함수를 열어보았습니다.

코드 분석은 **Atmel SAM3X**를 사용하는 [Arduino Due](https://docs.arduino.cc/hardware/due)를 기준으로 수행했습니다.

`cores/arduino/main.cpp`:

```cpp
/*
 * \brief Main entry point of Arduino application
 */
int main(void) {
    // Initialize watchdog
    watchdogSetup();

    init();

    initVariant();

    delay(1);

#if defined(USBCON)
    USBDevice.attach();
#endif

    setup();

    for (;;) {
        loop();
        if (serialEventRun)
            serialEventRun();
    }

    return 0;
}
```

모든 C++ 프로그램은 `main`에서부터 시작합니다.

아두이노가 실행되면 가장 먼저 `watchdogSetup`을 호출합니다.

`cores/arduino/watchdog.cpp`:

```cpp
extern "C" void _watchdogDefaultSetup(void) {
    WDT_Disable(WDT);
}
void watchdogSetup(void) __attribute__((weak, alias("_watchdogDefaultSetup")));
```

`watchdogSetup`은 `_watchdogDefaultSetup`으로 매핑되며, `WDT_Disable`를 호출합니다.

`system/CMSIS/Device/ATMEL/sam3xa/include/component/component_wdt.h`:

```cpp
/**
 * \brief Disable watchdog.
 *
 * \note The Watchdog Mode Register (WDT_MR) can be written only once.
 * Only a processor reset resets it.
 */
extern void WDT_Disable(Wdt* pWDT) {
    pWDT->WDT_MR = WDT_MR_WDDIS;
}
```

`WDT_MR`는 Watchdog Timer의 **Mode Register**를 의미합니다.

`WDT_MR_WDDIS`는 Watchdog Disable을 의미하며, **W**atch**d**og **T**imer **M**ode **R**egister **W**atch**d**og **Dis**able의 약자로 추정됩니다.

그 다음은 `init`을 호출합니다.

`variants/arduino_due_x/variant.cpp`:

```cpp
void init(void) {
    SystemInit();

    // Set Systick to 1ms interval, common to all SAM3 variants
    if (SysTick_Config(SystemCoreClock / 1000)) {
        // Capture error
        while (true)
            ;
    }

    // Initialize C library
    __libc_init_array();

    // Disable pull-up on every pin
    for (unsigned i = 0; i < PINS_COUNT; i++)
        digitalWrite(i, LOW);

    // Enable parallel access on PIO output data registers
    PIOA->PIO_OWER = 0xFFFFFFFF;
    PIOB->PIO_OWER = 0xFFFFFFFF;
    PIOC->PIO_OWER = 0xFFFFFFFF;
    PIOD->PIO_OWER = 0xFFFFFFFF;

    // Initialize Serial port U(S)ART pins
    PIO_Configure(
        g_APinDescription[PINS_UART].pPort,
        g_APinDescription[PINS_UART].ulPinType,
        g_APinDescription[PINS_UART].ulPin,
        g_APinDescription[PINS_UART].ulPinConfiguration);
    digitalWrite(0, HIGH); // Enable pullup for RX0
    PIO_Configure(
        g_APinDescription[PINS_USART0].pPort,
        g_APinDescription[PINS_USART0].ulPinType,
        g_APinDescription[PINS_USART0].ulPin,
        g_APinDescription[PINS_USART0].ulPinConfiguration);
    PIO_Configure(
        g_APinDescription[PINS_USART1].pPort,
        g_APinDescription[PINS_USART1].ulPinType,
        g_APinDescription[PINS_USART1].ulPin,
        g_APinDescription[PINS_USART1].ulPinConfiguration);
    PIO_Configure(
        g_APinDescription[PINS_USART3].pPort,
        g_APinDescription[PINS_USART3].ulPinType,
        g_APinDescription[PINS_USART3].ulPin,
        g_APinDescription[PINS_USART3].ulPinConfiguration);

    // Initialize USB pins
    PIO_Configure(
        g_APinDescription[PINS_USB].pPort,
        g_APinDescription[PINS_USB].ulPinType,
        g_APinDescription[PINS_USB].ulPin,
        g_APinDescription[PINS_USB].ulPinConfiguration);

    // Initialize CAN pins
    PIO_Configure(
        g_APinDescription[PINS_CAN0].pPort,
        g_APinDescription[PINS_CAN0].ulPinType,
        g_APinDescription[PINS_CAN0].ulPin,
        g_APinDescription[PINS_CAN0].ulPinConfiguration);
    PIO_Configure(
        g_APinDescription[PINS_CAN1].pPort,
        g_APinDescription[PINS_CAN1].ulPinType,
        g_APinDescription[PINS_CAN1].ulPin,
        g_APinDescription[PINS_CAN1].ulPinConfiguration);

    // Initialize Analog Controller
    pmc_enable_periph_clk(ID_ADC);
    adc_init(ADC, SystemCoreClock, ADC_FREQ_MAX, ADC_STARTUP_FAST);
    adc_configure_timing(ADC, 0, ADC_SETTLING_TIME_3, 1);
    adc_configure_trigger(ADC, ADC_TRIG_SW, 0); // Disable hardware trigger.
    adc_disable_interrupt(ADC, 0xFFFFFFFF); // Disable all ADC interrupts.
    adc_disable_all_channel(ADC);

    // Initialize analogOutput module
    analogOutputInit();
}
```

`init`의 가장 위에는 `SystemInit`이 있습니다.

`system/CMSIS/Device/ATMEL/sam3xa/source/system_sam3xa.c`:

```cpp
/**
 * \brief Setup the microcontroller system.
 * Initialize the System and update the SystemFrequency variable.
 */
void SystemInit(void) {
    /* Set FWS according to SYS_BOARD_MCKR configuration */
    EFC0->EEFC_FMR = EEFC_FMR_FWS(4);
    EFC1->EEFC_FMR = EEFC_FMR_FWS(4);

    /* Initialize main oscillator */
    if (!(PMC->CKGR_MOR & CKGR_MOR_MOSCSEL)) {
        PMC->CKGR_MOR = SYS_CKGR_MOR_KEY_VALUE | SYS_BOARD_OSCOUNT | CKGR_MOR_MOSCRCEN | CKGR_MOR_MOSCXTEN;
        while (!(PMC->PMC_SR & PMC_SR_MOSCXTS)) {
        }
    }

    /* Switch to 3-20MHz Xtal oscillator */
    PMC->CKGR_MOR = SYS_CKGR_MOR_KEY_VALUE | SYS_BOARD_OSCOUNT | CKGR_MOR_MOSCRCEN | CKGR_MOR_MOSCXTEN | CKGR_MOR_MOSCSEL;

    while (!(PMC->PMC_SR & PMC_SR_MOSCSELS)) {
    }
    PMC->PMC_MCKR = (PMC->PMC_MCKR & ~(uint32_t) PMC_MCKR_CSS_Msk) | PMC_MCKR_CSS_MAIN_CLK;
    while (!(PMC->PMC_SR & PMC_SR_MCKRDY)) {
    }

    /* Initialize PLLA */
    PMC->CKGR_PLLAR = SYS_BOARD_PLLAR;
    while (!(PMC->PMC_SR & PMC_SR_LOCKA)) {
    }

    /* Switch to main clock */
    PMC->PMC_MCKR = (SYS_BOARD_MCKR & ~PMC_MCKR_CSS_Msk) | PMC_MCKR_CSS_MAIN_CLK;
    while (!(PMC->PMC_SR & PMC_SR_MCKRDY)) {
    }

    /* Switch to PLLA */
    PMC->PMC_MCKR = SYS_BOARD_MCKR;
    while (!(PMC->PMC_SR & PMC_SR_MCKRDY)) {
    }

    SystemCoreClock = CHIP_FREQ_CPU_MAX;
}
```

`SystemInit`에서는 마이크로컨트롤러 시스템을 **초기화**하고, 시스템 주파수를 업데이트합니다.

코드 사이에 `while` 루프가 있는 이유는, 코드 상에서 값이 변경되더라도 **시스템에 영향**을 미칠 때까지 **시간**이 걸리기 때문에 반복문을 돌며 **기다리기** 위함입니다.

다시 `init`으로 돌아와 코드를 실행시키다 보면,

```cpp
for (unsigned i = 0; i < PINS_COUNT; i++)
    digitalWrite(i, LOW);
```

**모든 핀**을 `LOW`로 **설정**하는 것을 확인할 수 있습니다.

그리고 좀 더 아래에서,

```cpp
digitalWrite(0, HIGH); // Enable pullup for RX0
```

**RX0**를 위한 0번 핀만 `HIGH`로 **재설정**합니다.

`cores/arduino/wiring_constants.h`:

```cpp
#define HIGH 0x1
#define LOW  0x0
```

참고로 `HIGH`와 `LOW`의 값은 `unsigned int`로 각각 `1`, `0`으로 정의되어 있습니다.

`adc_*` 함수로 **아날로그 컨트롤러**까지 초기화하고 나면 `main` 함수로 돌아옵니다.

`init` 다음의 `initVariant`는 현재 아무 기능이 없는 함수입니다.

Variant의 사전적 의미는 "변종"이라는 뜻이며, `initVariant`는 특정 보드에서 **특별한 초기화가 추가로 필요**할 때 구현해서 사용하기 위해 정의된 함수입니다.

그다음 `delay(1)` 이후, 사용자가 정의한 `setup`이 호출됩니다.

> `delay` 함수 같은 경우는 **반복문**을 이용한 **Busy-waiting** 방식으로 구현되어 있습니다.
> 
> `cores/arduino/wiring.c`:
> 
> ```cpp
> void delay(unsigned long ms) {
>     if (ms == 0)
>         return;
>     uint32_t start = GetTickCount();
>     do {
>         yield();
>     } while (GetTickCount() - start < ms);
> }
> ```

`setup`이 끝나면 무한루프 `for (;;)`를 이용해 `loop`를 호출합니다.

코드를 통해 `loop`는 일정 시간마다 호출되는 함수가 아니라, 이전 루프가 끝나는 대로
`for`에 의해 **연속적으로 호출**되는 함수임을 알 수 있습니다.

`loop`가 끝날 때마다 `serialEventRun`이 호출되는데, `serialEventRun`은 Serial 버퍼에
데이터가 있다면 `serialEvent`를 호출합니다.

`variants/arduino_due_x/variant.cpp`:

```cpp
UARTClass Serial(UART, UART_IRQn, ID_UART, &rx_buffer1, &tx_buffer1);
void serialEvent() __attribute__((weak));
void serialEvent() { }

USARTClass Serial1(USART0, USART0_IRQn, ID_USART0, &rx_buffer2, &tx_buffer2);
void serialEvent1() __attribute__((weak));
void serialEvent1() { }
USARTClass Serial2(USART1, USART1_IRQn, ID_USART1, &rx_buffer3, &tx_buffer3);
void serialEvent2() __attribute__((weak));
void serialEvent2() { }
USARTClass Serial3(USART3, USART3_IRQn, ID_USART3, &rx_buffer4, &tx_buffer4);
void serialEvent3() __attribute__((weak));
void serialEvent3() { }

void serialEventRun(void) {
    if (Serial.available())
        serialEvent();
    if (Serial1.available())
        serialEvent1();
    if (Serial2.available())
        serialEvent2();
    if (Serial3.available())
        serialEvent3();
}
```

`serialEvent`는 프로그래머가 **시리얼 ISR**로 구현할 수 있는 함수입니다.

`main` 마지막의 `return 0`는 무한루프로 인해 영원히 실행되지 않는 코드입니다.
