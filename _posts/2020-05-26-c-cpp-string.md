---
title: "C++ char*를 사용할 수 없습니까? why? const char*로 대체되었다."
date: 2020-05-26
author: Astro36
category: cpp
tags: [c, cpp, syntax, string]
---

C언어에서 사용하는 문자열은 null-terminated string을 따르며 일반적으로 `char*`로 표현된다.

이때, 문자열은 리터럴(Literal)을 이용해 정의할 수 있는데 문자열 리터럴은 Read-Only 메모리에 저장되며 **수정할 수 없다**.

> C언어에서 문자열 다루는 방법에 대해 모른다면 아래의 글을 읽고 오는 게 도움이 된다.
>
> 참고: [C 문자열: 리터럴, 포인터, 배열](https://int-i.github.io/c/2020-04-03/c-string/)

마찬가지로 C++에서도 `std::string` 대신 null-terminated string을 이용해 문자열을 나타낼 수 있고,

C와 같이 문자열 리터럴으로 정의된 문자열은 **수정할 수 없다**는 것이 동일하다.

그러나, C++에서는 문자열을 `const char*`가 아닌 `char*`로 표현하면 **컴파일 오류**가 발생한다.

이번 글에서는 C와 C++의 문자열에 대한 `char*` 사용과 오류의 원인에 대해 알아볼 것이다.

## 암시적 변환

사실 C언어에서도 문자열 리터럴은 **상수 포인터(Const Pointer)**로 `const char*`를 이용해 표현한다.

하지만, C에서는 상수 포인터과 비상수(non-const) 포인터 사이의 **암묵적인 변환**을 지원하기 때문에 **오류가 발생하지 않는다**.

따라서 아래와 같은 코드는 정상적으로 작동한다.

```c
const char* s1 = "hello"; // ok
char* s2 = "hi"; // ok
```

위 코드에서 `"hi"`는 문자열 리터럴이기 때문에 수정할 수 없고 상수 포인터로 표현해야 되지만, 상수-비상수 포인터 사이의 **암묵적인 변환**이 일어났기 때문에 `char*`로써 표현할 수 있다.

반면, C++에서는 상수-비상수 포인터 사이의 **암묵적인 변환이 일어나지 않는다**.

따라서 아래와 같은 코드는 **컴파일 오류**가 발생한다.

```cpp
const char* s1 = "hello"; // ok
char* s2 = "hi"; // error
```

C++에서 문자열 리터럴은 항상 `const char*`로, **명시적으로 수정할 수 없음**을 나타내야 한다.

그렇다면, 여기서 한 가지 의문을 가질 수 있다.

과거에 작성된 C++ 코드 중 문자열을 `char*`로 표현한 경우가 있다.
어떻게 이것이 가능했을까?

## 과거의 C++

C++11 미만에서는 상수 포인터를 비상수 포인터로 변환하는 것은 오류가 아닌 Deprecated 기능이었다.

그렇기 때문에 이전에는 문자열을 `char*`로 표현해도 컴파일 **경고만 발생**할 뿐, 코드는 **정상적으로 실행**됐다.

그 후, C++11부터 암시적으로 상수 포인터를 비상수 포인터로 변환하는 것이 **오류로 취급**되며, 현재 컴파일러에서는 코드를 실행할 수 없게 되었다.

## 결론

C에서는 상수-비상수 포인터 간 암시적 변환을 통해 `char*`으로 문자열을 표현할 수 있다.

C++에서는 암시적 변환이 일어나지 않기 때문에 `const char*`로 문자열을 표현해야 한다.

과거의 컴파일러는 암시적 변환을 지원했지만, 현재의 컴파일러는 오류로 취급하기 때문의 예전에 작성된 코드는 실행이 안 될 수도 있다.
