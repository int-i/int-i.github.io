---
title: "나는 부름을 받았고, 응해야 하오... 언제든. 인터럽트와 ISR (with TCA)"
date: 2023-07-04
author: Astro36
category: cpp
tags: [cpp, c, hardware, arduino, embedded_system, interrupt, isr, tca]
thumbnail: /assets/posts/2023-07-04-arduino-interrupt/thumbnail.jpg
---

**인터럽트**(Interrupt)는 프로세서가 프로그램을 실행하는 중 입출력 등의 장치에서 **예외**가 발생하여 즉각적인 처리가 필요할 경우 **프로세서에 알리는** 기법입니다.

**폴링**(Polling)과 대비되는 개념인데, 폴링은 예외가 발생했는지 프로세서가 **주기적으로 확인**하는 방법이지만,

**인터럽트**는 예외가 발생했을 때 프로세서를 호출하는 방식입니다.

- 인터럽트: 예외 발생 -> 프로세서 호출
- 폴링: 프로세서 -> 예외 검사

프로세서는 **인터럽트**를 감지하면 **실행 중인 코드를 중단**하고, 해당 인터럽트를 위한 처리 프로그램으로 **점프**하여 인터럽트를 처리합니다.

여기서 **인터럽트 처리**를 위한 프로그램을 **인터럽트 서비스 루틴**(ISR; Interrupt Service Routine)이라고 합니다.

## Arduino

**아두이노**에서도 **ISR**를 이용해 특정 인터럽트가 발생했을 때를 감지할 수 있습니다.

`attachInterrupt(pin, isr, mode)`는 지정한 **핀의 값**(`HIGH`, `LOW`)이 변할 때 **ISR 을 호출**하도록 등록하는 함수입니다.

아두이노 Due 보드에서는 **모든 핀**에 ISR을 등록할 수 있고, `mode`로 사용 가능한 값은 `LOW`, `CHANGE`, `RISING`, `FALLING`, `HIGH`가 있습니다.

ISR 사용 시, **주의사항**으로는 ISR 내부에서 `delay`와 `millis` 함수는 정상적을 동작하지 않다는 것입니다.

`delay`는 동작하기 위해 **인터럽트**가 필요하므로 **ISR 내부**에서 호출되는 경우에는 작동하지 않습니다.

마찬가지로, `millis`도 현재 시각을 계산하기 위해 **인터럽트**을 이용하므로 **ISR 내부**에서 값이 증가하지 않습니다.

반면, `delayMicroseconds`는 카운터를 사용하지 않으므로 ISR 내부에서도 **정상**적으로 작동합니다.

```cpp
#define LD0 13 // 1초마다 점멸하는 LED
#define LD1 20
#define SW 21

bool LD1_state = false; // LD1의 상태를 false로 초기화

void setup() {
    pinMode(LD0, OUTPUT);
    pinMode(LD1, OUTPUT);
    pinMode(SW, INPUT_PULLUP);
    attachInterrupt(SW, SW_ISR, FALLING); // 스위치 Interrupt를 FALLING EDGE에 연결
}

void loop() {
    digitalWrite(LD0, LOW);
    delay(1000);
    digitalWrite(LD0, HIGH);
    delay(1000);
}

// 스위치 Interrupt Service Routine
void SW_ISR() {
    LD1_state = !LD1_state;
    digitalWrite(LD1, LD1_state);
    delayMicroseconds(100000); // 100ms
}
```

위의 코드에서 `LD0` 핀은 **1초마다 점멸**하는 LED이고, `LD1`은 사용자가 스위치를 누르면 **LED의 상태**가 변경되는 코드입니다.

`attachInterrupt` 함수를 사용해서 스위치 핀의 Falling Edge(`HIGH`->`LOW`)에서 인터럽트를 발생하도록 하는데, 인터럽트가 발생하면 `SW_ISR` 함수가 호출돼 `LD1`의 상태를 반전시킵니다.

## ATmega4809

아두이노의 `attachInterrupt`를 사용하지 않고, 직접 인터럽트를 받기 위해서는 `ISR`을 정의해야 합니다.

```cpp
#define F_CPU 16000000

#include <avr/interrupt.h>
#include <avr/io.h>

unsigned int t = 0;

void setup() {
    // 1 clock = 1/16MHz = 62.5ns
    // after div256 -> 1 clock = 62.5us * 256 = 16us
    // period = 0xff -> 1 interrupt = 16us * 256 = 4096us = 4.096ms

    TCA0_SINGLE_PER = 0xff;
    TCA0_SINGLE_INTCTRL = TCA_SINGLE_OVF_bm;
    TCA0_SINGLE_CTRLA = TCA_SINGLE_CLKSEL_DIV256_gc | TCA_SINGLE_ENABLE_bm;

    sei();
}

void loop() {
    unsigned int T = 3; // [s]
    if (t == T * F_CPU / 65536) { // T * F_CPU / (DIV * (PERIOD + 1))
        digitalWrite(7, HIGH);
        delay(100);
        digitalWrite(7, LOW);
        t = 0;
    }
}

ISR(TCA0_OVF_vect) {
    t += 1;
    TCA0_SINGLE_INTFLAGS = TCA_SINGLE_OVF_bm;
}
```

위 코드는 3초마다 LED를 점멸하는 코드입니다.

**인터럽트**를 사용하기 전에는, `sei`(Set Global Interrupt Flag)를 호출해 **전역 인터럽트를 활성화**해야 합니다.

`TCA0_SINGLE_INTCTRL = TCA_SINGLE_OVF_bm`를 통해서 TCA에서 Overflow가 발생할 때마다 인터럽트가 호출되도록 정의합니다.

호출된 인터럽트는 `ISR(TCA0_OVF_vect)`에서 처리되는데,

**ISR 함수**가 종료되기 전에 `TCA0_SINGLE_INTFLAGS = TCA_SINGLE_OVF_bm`를 통해서 **인터럽트 플래그를 수동으로 초기화**시켜야 합니다.

참고: [Getting Started with Timer/Counter Type A (TCA)](https://ww1.microchip.com/downloads/en/Appnotes/TB3217-Getting-Started-with-TCA-DS90003217.pdf)
