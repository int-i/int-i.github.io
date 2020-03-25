---
title: "C++ SFINAE: 치환 실패는 오류가 아님"
date: 2020-03-25
author: Astro36
category: cpp
tags: [cpp, syntax, template, sfinae, type]
---

> 템플릿 오류를 이용한 함수 오버로딩 테크닉

SFINAE는 Substitution Failure Is Not An Error(치환 실패는 오류가 아님)의 약자로, 템플릿 매개변수에 자료형이나 값을 넣을 수 없어도 컴파일 **오류가 발생하지 않고** 해당 템플릿에 대해서는 코드 생성을 무시하는 현상을 말합니다.
템플릿 메타 프로그래밍의 기초가 되는 기법으로, 템플릿의 매개변수(타입 이름 등) 입력에 제약을 걸어주고 함수 오버로딩 시 프로그래머가 함수 선택을 제어할 수 있게 합니다.

## 예시

아래는 SFINAE의 기본 예시입니다.

```cpp
#include <iostream>

struct Case {
    using inner_t = int; // `inner_t`를 정의, `Case::inner_t`는 `int`
};

template<typename T>
void println(typename T::inner_t t) { // 만약, `T`에 `inner_t`가 정의되어 있다면 이 함수를 오버로딩
    // `t`의 타입은 `T::inner_t`
    std::cout << "inner_t is defined: " << t << std::endl;
}

template<typename T>
void println(T t) { // 만약, `T`에 `inner_t`가 정의되어 있지 않다면 이 함수를 오버로딩
    std::cout << "inner_t is not defined: " << t << std::endl;
}

int main() {
    println<Case>(10);
    println<int>(20);
    return 0;
}
```

```text
inner_t is defined: 10
inner_t is not defined: 20
```

주어진 타입 인자 `Case`, `int`에 따라 `println` 함수가 다르게 호출되는 것을 볼 수 있습니다.

- `println<Case>`에는 `Case::inner_t`가 `int`로 정의되어 있었기 때문에 정상적으로 `int`로 치환되어 첫 번째 `println` 함수가 오버로딩 될 수 있었습니다.
- `println<int>`에 경우 `int::inner_t`는 정의되지 않아 치환 실패가 발생합니다. 하지만, 컴파일 오류가 발생하지 않고 이어 두 번째 `println` 함수 템플릿을 확인해 이에 오버로딩 되었습니다.

참고: [SFINAE 예시](https://github.com/jwvg0425/ModernCppStudy/wiki/SFINAE)

## 활용

C++의 `virtual` 키워드가 상속을 통해 동적 다형성(Dynamic Polymorphism)을 구현하는 역할을 했다면, SFINAE는 템플릿을 통해 정적 다형성(Static Polymorphism)을 구현합니다.
정적 다형성은 컴파일 시간에 함수가 결정되기 때문에, 프로그램 실행 이후 vtable에서 함수를 탐색하고 호출을 결정해야 하는 동적 다형성에 비해 빠르게 동작합니다.

아래는 `Point`의 템플릿 인자 `T`에 따라 함수를 다르게 호출하는 예시입니다.

```cpp
#include <iostream>
#include <string>
#include <type_traits>

template<typename T>
struct Point {
    std::string name;
    T x;
    T y;
};

template<typename T>
typename std::enable_if_t<std::is_integral_v<T>> println_point(const Point<T>& point) { // `T`가 정수형이면 이 함수를 오버로딩
    std::cout << point.name << '<' << typeid(T).name() << '>' << " = integral point (" << point.x << ", " << point.y << ")" << std::endl;
}

template<typename T>
typename std::enable_if_t<!std::is_integral_v<T>> println_point(const Point<T>& point) { // `T`가 정수형이 아니면 이 함수를 오버로딩
    std::cout << point.name << '<' << typeid(T).name() << '>' << " = non-integral point (" << point.x << ", " << point.y << ")" << std::endl;
}

int main() {
    Point<int> p0{ "p0", 1, 2 };
    Point<long long> p1{ "p1", 3ll, 4ll };
    Point<float> p2{ "p2", 0.1f, 0.2f };
    Point<double> p3{ "p3", 0.3, 0.4 };
    println_point(p0);
    println_point(p1);
    println_point(p2);
    println_point(p3);
    return 0;
}
```

```text
p0<int> = integral point (1, 2)
p1<__int64> = integral point (3, 4)
p2<float> = non-integral point (0.1, 0.2)
p3<double> = non-integral point (0.3, 0.4)
```

`std::is_integral_v<T>`는 `std::is_integral<T>::value`의 약칭(alias)으로 `T`가 정수형(`int`, `long`, `char`, `bool` 등)인지 확인하고 `true` 또는 `false`를 반환하는 템플릿 메타 함수(template meta function)입니다.
메타 함수란 보통의 함수처럼 값에 대해 연산을 하는 것이 아닌 타입에 대해 연산을 합니다.
또한, 템플릿 함수이기 때문에 `()`을 이용해 호출하지 않고 `<>`로 템플릿 인자를 전달함을 확인할 수 있습니다.

```cpp
#include <iostream>
#include <type_traits>

int main() {
    std::cout << std::is_integral_v<int> << std::endl
              << std::is_integral_v<float> << std::endl;
    return 0;
}
```

```text
1
0
```

참고: [C++ `std::is_integral`](https://en.cppreference.com/w/cpp/types/is_integral)

`std::enable_if_t<B, T = void>`는 `std::enable_if<B, T = void>::type`의 약칭(alias)으로 `B`가 `true`이면 `T`를 반환하는 템플릿 메타 함수입니다.
(정확히는 `::type`을 `T` 타입으로 정의함)

```cpp
template<bool B, class T = void>
struct enable_if {};

template<class T>
struct enable_if<true, T> {
    typedef T type;
};
```

`enable_if`의 구현을 보면 알 수 있듯, `B`가 `true`라면 두 번째 템플릿 코드가 적용되어 `type`을 `T`로 정의합니다. (`enable_if<true, T>::type == T`)
`B`가 `false`면 첫 번째 템플릿이 적용되어 `enable_if<true, T>::type`의 치환 실패를 유도합니다.

참고: [C++ `enable_if`](https://en.cppreference.com/w/cpp/types/enable_if)

다시 `println_point` 함수로 돌아가 해석을 하면, `T`가 정수형(`std::is_integral_v<T>`가 `true`)이면 첫 번째 템플릿은 `typename std::enable_if_t<std::is_integral_v<T>> println_point`가 `void println_point`로 치환되고 두 번째 템플릿은 치환 실패가 발생해 첫 번째 함수로 오버로딩됩니다.
반대로 `T`가 정수형이 아닐(`!std::is_integral_v<T>`가 `true`) 경우 첫 번째 템플릿은 치환 실패가 발생하고 두 번째 템플릿은 치환에 성공해 두 번째 `println_point`으로 오버로딩됩니다.

참고: [type_traits 라이브러리, SFINAE, enable_if](https://modoocode.com/295)
