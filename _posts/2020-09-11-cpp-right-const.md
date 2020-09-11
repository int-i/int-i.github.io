---
title: "int const i; C++ 오른쪽 const 표기 컨벤션"
date: 2020-09-11
author: Astro36
category: cpp
tags: [c, cpp, syntax, const, coding_convention, template]
---

대부분의 프로그래밍 언어에서 `const` 키워드는 타입의 왼쪽에 표기되지만, C와 C++에서 `const`는 다른 언어들과 다르게 타입의 **오른쪽에도 표기**할 수 있습니다.
이번 글에서는 타입의 오른쪽에 `const`를 표기하는 코딩 컨벤션을 소개해 드리겠습니다.

```cpp
const int i = 100;
int const i = 100;
```

> 2가지의 선언은 완전히 **동일한 선언**입니다.

`const`를 오른쪽에 표기하는 코딩 컨벤션은 [C++ 템플릿 가이드(C++ Templates: The Complete Guide)](http://ultra.sdk.free.fr/docs/DxO/C%2B%2B%20Templates%20The%20Complete%20Guide.pdf)에서 소개되었습니다.

이 책에서는 `const`를 오른쪽에 작성해야 되는 컨벤션의 근거로 2가지 이유를 제시했습니다.

## 가독성

첫 번째는 **가독성**입니다.

대부분의 언어에서 왼쪽에 `const`를 붙이므로 오히려 가독성을 해하는 것이 아니냐고 반문하실 수 있지만, C/C++에서의 `const`는 **규칙이 조금 다릅니다**.

> C/C++ `const` 적용 규칙:
>
> `const`는 기본적으로 **오른쪽에서 왼쪽**으로 수식하되, 왼쪽에 **수식 대상이 없을 때**만 **왼쪽에서 오른쪽**으로 수식한다.

```cpp
const int i = 100; // (1)
int const i = 100; // (2)
```

1의 경우는 `const` 왼쪽에 아무런 **수식 대상이 없기** 때문에 **오른쪽**에 위치한 `int`를 수식합니다.

2의 경우는 `const`의 **왼쪽**에 `int`가 있기 때문에 `int`를 수식합니다.

여기까지만 보면 크게 가독성이 향상되는 것 같지 않지만, 만약 **포인터**가 들어오면 상황이 달라집니다.

```cpp
const char *const s = "abcd"; // (1)
char const *const s = "abcd"; // (2)
```

1의 경우, 첫 번째 `const`는 **오른쪽**의 `char`을 수식하지만 두 번째 `const`는 **왼쪽**의 `*`을 수식합니다.
즉, 한 선언 안에 **수식하는 방향이 다른** `const`가 혼재하게 됩니다.

2의 경우, 두 `const` 모두 자신의 **왼쪽**에 있는 `char`과 `*`를 각각 수식하게 됩니다.

함수 포인터 등으로 **식이 복잡**해질수록 **타입의 오른쪽**에 `const`를 표기하는 컨벤션은 **가독성에 유리**하게 작용합니다.

## alias 선언에서의 직관성

코드에 아래와 같은 type alias가 있다고 가정합시다.

```cpp
typedef char *CHARS;
```

타입의 **왼쪽**에 `const`를 붙이는 컨벤션을 고집해, 새로운 타입을 선언한다면 아래와 같이 표현할 수 있습니다.

```cpp
typedef const CHARS CONST_PTR; // (1)
```

이는 아래의 표현과 같습니다.

```cpp
typedef const char *CONST_PTR;
```

> `const`는 오른쪽의 `char`를 수식합니다.

일반적인 관점에서는 **포인터의 alias**에 `const`를 붙였으므로 **상수 포인터(const pointer)**가 되는 것이 맞습니다.

하지만, 위는 상수 포인터가 아닌 **상수 문자(const char)**을 가리키는 **일반 포인터**입니다.

이번에는 타입의 **오른쪽**에 `const`를 붙여 표현합시다.

```cpp
typedef CHARS const CONST_PTR; // (2)
```

이는 아래의 표현과 같습니다.

```cpp
typedef char *const CONST_PTR;
```

> `const`는 왼쪽의 `*`을 수식합니다.

우리의 직관대로 `CONST_PTR`는 문자(char)을 가리키는 **상수 포인터**가 되었습니다.

## 결론

타입의 오른쪽에 `const`를 표기하는 컨벤션은 분명 익숙하지 않은 규칙입니다.

하지만, C/C++의 차이점을 받아드리고 새로운 규칙에 적응한다면 읽기 좋은 코드를 작성하는 데도 도움이 될 것입니다.

저도 오른쪽 `const` 표기법이 분명 강점이 있다고 생각하기에 블로그에 기록하여 추천해 드리는 바입니다.
