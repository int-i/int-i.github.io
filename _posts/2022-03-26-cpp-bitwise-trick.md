---
title: "C++ 비트 연산자 꿀팁 모음: 미안해요.. 다시는 안 쓰기로 했는데..."
date: 2022-03-26
author: Astro36
category: cpp
tags: [cpp, algorithm, bitwise, operator, trick]
thumbnail: /assets/posts/2022-03-26-cpp-bitwise-trick/thumbnail.jpg
---

비트 연산자(Bitwise Operator)는 **비트(Bit) 단위**의 **논리 연산**을 수행하는 연산자입니다.

처음 C/C++을 배울 때는 이런 복잡한 녀석을 도대체 어디에 사용하나 싶지만, 생각 외로 **복잡한** 코드를 **짧게** 압축하는 데 도움이 될 수 있습니다.

그 중 외워두면 **코딩테스트**에서 도움이 될 만한 **몇 가지 트릭**을 소개하겠습니다.

## XOR swap

두 변수의 값을 서로 바꾸려면 **3개의 변수**가 필요하다고 알려져 있습니다.

```cpp
int a = 1;
int b = 2;

// swap
int temp = a;
a = b;
b = c;
```

하지만 **XOR 연산자**를 이용하면 새로운 변수 없이도 값을 **교환**할 수 있습니다.

```cpp
if (a != b) {
    a ^= b;
    b ^= a;
    a ^= b;
}
```

**한 줄**로 줄여 쓸 수도 있습니다.

```cpp
if (a != b) {
    a ^= b ^= a ^= b;
}
```

> 함수를 **직접 구현**해야 하는 상황이 아니라면, 변수 값을 **교체**할 때는 [`std::swap`](https://en.cppreference.com/w/cpp/algorithm/swap)을 사용하는 것을 **권장**합니다.

## $$2^n$$ 곱셈

시프트(Shift) 연산은 **비트를 좌우**로 밀고 당기는 연산자입니다.

숫자가 **이진법**으로 표현되어 컴퓨터에 저장되는 것을 생각해보면,

한 칸 왼쪽으로 미는 것을 **2를 곱하는 것**이고,

```cpp
int a = 10;
a <<= 1;
a; // 20
```

한 칸 당기는 것은 **2로 나누는 것**입니다.

```cpp
int a = 10;
a >>= 1;
a; // 5
```

여러 칸을 움직이면 $$2^n$$을 곱하고 나누게 됩니다.

```cpp
int a = 10;
a <<= 3;
a; // 80

int b = 60
b >>= 2;
b; // 15
```

## 대소문자 변환

비트 연산자를 이용해 알파벳 **대소문자 변환**을 빠르게 할 수 있습니다.

### 대문자 -> 소문자

```cpp
int c = 'A';
c |= ' ';
c; // 'a'

c = 'Z';
c |= ' ';
c; // 'z'
```

### 소문자 -> 대문자

```cpp
int c = 'a';
c &= '_';
c; // 'A'

int c = 'z';
c &= '_';
c; // 'Z'
```

처음 보면 "무슨 뜻이야?" 싶지만, 외워두면 **유용**하게 사용할 수 있는 트릭입니다.

작동 **원리**보다는 `|=' '`, `&='_'` 식 자체를 **외우는 게** 도움될 것 같습니다.

참고: [Bit Tricks for Competitive Programming](https://www.geeksforgeeks.org/bit-tricks-competitive-programming/)
