---
title: "C 비표준: fflush(stdin)를 사용하지 마세요"
date: 2020-04-26
author: Astro36
category: c
tags: [c, fflush, stdin]
---

C언어에서 `scanf` 함수를 사용하는 코드를 보다 보면 종종 `fflush(stdin)` 함수를 보곤 한다.

결론부터 말하자면, `fflush`의 정의는 출력 버퍼를 비우는 함수다.
따라서 표준입력인 `stdin`을 `fflush`에 넣는 것은 함수 설계 의도에 위배된다.

하지만 이러한 이유에도 `fflush(stdin)`는 잘못 사용되고 있어 C언어를 처음 배우는 사람에게 혼란을 주곤 한다.

오래전에 작성된 코드에는 `scanf`와 함께 `fflush(stdin)`를 사용하고, 심지어 한국의 C언어 입문 베스트셀러에는 `fflush(stdin)`을 사용해서 입력 버퍼를 비우던데 어떻게 이런 일이 가능할까?

## fflush 표준 확장

[POSIX](https://en.wikipedia.org/wiki/POSIX)는 fflush의 표준을 확장에 입력 버퍼에서도 동작하게 정의했다.
쉽게 말하면 C언어의 표준을 확장해 자신들만의 표준을 만들었다는 것이다.

마이크로소프트 역시 과거 Visual Studio 2013 이하 버전에서는 `fflush(stdin)`가 표준 입력 버퍼를 비우도록 동작했었다.
하지만 Visual Studio 2015 이상 버전부터는 C의 표준을 따라가기 위해 `fflush(stdin)` 아무런 동작을 하지 않도록 돌려놓았다.

이 때문에 지금은 예전 C 입문서에 있는 `fflush(stdin)` 코드를 그대로 따라쳐도 작동되지 않는다.

참고: [C fflush](https://en.cppreference.com/w/c/io/fflush)

## fflush(stdin) 대체

`scanf` 함수와 같이 사용되던 `fflush(stdin)`은 주로 개행문자 `'\n'`을 버리기 위해 사용된다.

따라서 `getchar`로 문자를 읽어가며 `'\n'`이 나올 때까지 파일 포인터의 위치를 옮겨주면 된다.

```c
while (getchar() != '\n');
```
