---
title: "C++ 템플릿 문법 복습하기"
date: 2020-03-11
author: Astro36
category: cpp
tags: [cpp, syntax, review, template]
---

이 글은 작년 한 해 객체지향 프로그래밍 과목에서 동안 배운 C++ 문법 중 템플릿과 관련된 내용을 요약 정리한 문서입니다. C++만의 고유한 특징과 더 나은 코드를 작성하기 위해 같이 알아두면 좋은 내용 위주로 정리했습니다. 기초적인 문법은 생략되었으니 기초적인 부분이 필요하시면 강의노트와 함께 복습하시기를 권장합니다.

## 개념

템플릿(template)은 말 그대로 코드를 찍어내는 틀이며, 서로 다른 자료형에 대해 수행되는 코드를 여러개 만들 필요 없이 일반적인 자료형에 대한 프로그래밍(=[제너릭 프로그래밍](https://en.wikipedia.org/wiki/Generic_programming))을 가능하게 합니다. 또한, C++의 템플릿은 튜링 완전성을 가지고 있기 때문에 컴퓨터가 표현가능한 식은 모두 처리할 수 있습니다.

```cpp
template<typename T>
T sum(T a, T b) {
    return a + b;
}

sum<int>(1, 2); // 3
sum<float>(1.1, 2.2); // 3.3
```

예를 들어, 위의 템플릿 코드는 아래와 같이 처리됩니다.

```cpp
// 함수 이름은 예시일 뿐이며, 실제로 함수 이름이 이렇게 생성되지 않음
int sum_int(int a, int b) {
    return a + b;
}

float sum_float(float a, float b) {
    return a + b;
}

sum_int(1, 2); // 3
sum_float(1.1, 2.2); // 3.3
```

코드를 보시다 싶이, `sum` 템플릿 함수는 `sum_int`와 `sum_float`를 찍어내는 틀이 되어 코드를 생성했습니다.

> `template<typename T>`은 과거에 `template<class T>` 형태로 작성되었으나, `class`가 주는 어감(ex. `int`, `char` 등은 클래스가 아니지만 `T`에 들어올 수 있음)으로 인해 `typename`이 추가되었습니다. `class`와 `typename`은 이름만 다를 뿐 완전히 동일한 의미의 키워드로, `typename` 사용을 권장합니다.

함수 뿐만 아니라 구조체, 클래스 등에도 `template`을 사용할 수 있습니다.

```cpp
template<typename T = int>
struct Complex {
    T real;
    T imaginary;
};
```

템플릿 인자 역시 기본 인자(default parameter)를 가질 수 있습니다.

참고: [C++ Template](https://modoocode.com/219)

### 템플릿 특수화

```cpp
struct Complex {
    int real;
    int imaginary;
};

template<typename T>
T sum(T a, T b) {
    return a + b;
}

template<>
Complex sum(Complex a, Complex b) {
    return Complex {
        a.real + b.real,
        a.imaginary + b.imaginary
    };
}

sum(1, 2); // 3
sum(1.1, 2.2); // 3.3
sum(Complex { 1, 2 }, Complex { 3, 4 }); // Complex { 4, 6 }
```

> `sum(1, 2)`을 `sum<int>(1, 2)`으로 쓰지 않아도 되는 이유는 함수 인자 `1`에서 `int`라는 정보를 추론할 수 있기 때문입니다.

`Complex` 구조체에 대해서는 `template<typename T> sum` 템플릿이 아닌 아래의 `template<> sum` 함수가 호출됩니다. 이처럼 특정한 타입에 대해 템플릿 코드를 선택하는 것을 템플릿 특수화라 합니다.

> `std::vector<bool>`이 대표적인 템플릿 특수화의 사례입니다.

### 비타입(non-type) 템플릿 인자

템플릿 인자로 [`typename` 이외의 것](https://en.cppreference.com/w/cpp/language/template_parameters)도 전달할 수 있습니다.

```cpp
template<int i>
int bonus(int n) {
    return n + i;
}

bonus<100>(10); // 110
```

예를 들어, 위의 템플릿 코드는 아래와 같이 처리됩니다.

```cpp
// 함수 이름은 예시일 뿐이며, 실제로 함수 이름이 이렇게 생성되지 않음
int bonus_100(int n) {
    return n + 100;
}

bonus_100(10); // 110
```

> `std::array`가 대표적인 비타입(non-type) 템플릿 인자 사용 사례입니다.

## 특징

### 장점

- 제너릭 프로그래밍을 통해 일반화된 알고리즘 구현 가능
- 컴파일 시간에 코드를 생성해 최적화하기 때문에 더 빠르게 동작함
- 극단적인 TMP(Template Metaprogramming) 기법을 이용하면 컴파일 시간에 모든 계산이 끝나는 시간복잡도 O(1) 코드를 만들 수 있음 (대신 바이너리 파일 크기가 그만큼 커짐)

### 단점

- 컴파일 시간에 처리해야 되는 작업이 늘어나므로 컴파일 시간이 길어짐
- 템플릿으로 인자 조건만 다른 코드를 찍어내는 것이기 때문에 결과적으로 바이너리 크기가 커짐
- 템플릿은 대부분 헤더파일에 있어야 되기 때문에 정의와 구현이 모두 헤더파일에 존재하게 됨
- 가독성이 떨어지고 템플릿 코드 작성과 디버깅이 어려움

~~프로그래밍계의 흑마법~~

참고: [Template metaprogramming](https://en.wikipedia.org/wiki/Template_metaprogramming)
