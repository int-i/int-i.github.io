---
title: "C/C++ Array Decay: 배열이 있었는데요 없었습니다"
date: 2020-04-12
author: Astro36
category: cpp
tags: [c, cpp, syntax, array, pointer]
---

> 배열이 수식에서 사용될 때 포인터로 변환되는 현상

Array Decay는 Array to Pointer Decay라고도 불리며, C와 C++에서 배열을 다룰 때 암시적 변환([Implicit Conversion](https://en.cppreference.com/w/cpp/language/implicit_conversion))에 의해 발생하는 현상이다.
여기서 Decay는 배열의 크기 정보를 잃어버리고 포인터로 붕괴한다는 의미에서 유래되었다.

> 이 글에서 다루는 배열이란 C 스타일의 배열(ex. `T array[N];`)을 뜻한다.

## 배열과 포인터

처음 C/C++을 배울 때 많은 사람이 헷갈리는 것 중 하나가 배열과 포인터의 관계이다.

핵심을 말하자면 배열은 배열이고 포인터는 포인터이다.
다만, 아래에 서술할 이유로 **배열을 포인터의 형태로 나타낼 수 있었던 것** 뿐이다.

배열은 메모리에 값이 연속적으로 배치된 형태의 변수로 타입 정보(T)와 배열의 크기 정보(N)을 가지고 있다.

그 예로 배열은 `sizeof`를 사용했을 때 $$T\times{N}$$이 나오게 된다.
그에 비해 포인터는 `sizeof`를 사용하면 32비트에서는 4, 64비트에서는 8을 반환한다.

```cpp
#include <iostream>

int main() {
    int a[3] = { 1, 2, 3 };
    int i = 10;
    int* p = &i;
    std::cout << "a size: " << sizeof(a) << std::endl
              << "p size: " << sizeof(p) << std::endl;
    return 0;
}
```

```text
a size: 12
p size: 8
```

## 암시적 변환

그렇다면 어떻게 지금까지 배열을 포인터로 사용했을까?

배열은 수식에서 사용될 때 **암시적**으로 배열로 변환된다.
포인터로 변환되면서 배열의 크기 정보를 잃어버리기 때문에 **포인터로 붕괴**(decay) 된다고도 한다.

```cpp
#include <iostream>

int main() {
    int a[3] = { 1, 2, 3 };
    auto b = a;
    std::cout << "a size: " << sizeof(a) << std::endl
              << "b size: " << sizeof(b) << std::endl;
    return 0;
}
```

```text
a size: 12
b size: 8
```

`a`를 단순히 `b`로 변환했을 뿐인데 `b`는 크기 정보를 잃어버리고 **포인터로 인식**되고 있다.

이는 함수의 인자로 배열을 넘길 때도 발생한다.

```cpp
#include <iostream>

void f(int b[3]) {
    std::cout << "b size: " << sizeof(b) << std::endl;
}

int main() {
    int a[3] = { 1, 2, 3 };
    std::cout << "a size: " << sizeof(a) << std::endl;
    f(a);
    return 0;
}
```

```text
a size: 12
b size: 8
```

무려 `b`에 `void f(int b[3])` 형태로 타입(`int`)과 크기(3)를 알려줬음에도 배열이 포인터로 변환된 것을 확인할 수 있다.

이 때문에 배열의 인자로 받을 때는 **배열의 크기**를 명시적(ex. `void f(int* array, int size);`)으로 넘기거나, 아래와 같이 참조를 이용해 배열을 넘겨야 한다.

```cpp
#include <iostream>

void g(int (&c)[3]) {
    std::cout << "c size: " << sizeof(c) << std::endl;
}

int main() {
    int a[3] = { 1, 2, 3 };
    std::cout << "a size: " << sizeof(a) << std::endl;
    g(a);
    return 0;
}
```

```text
a size: 12
c size: 12
```

참조를 이용하면 `c`가 포인터로 붕괴하지 않고 배열인 것을 확인할 수 있다.

참고: [Array-to-pointer decay](https://en.cppreference.com/w/cpp/language/array#Array-to-pointer_decay)

## 암시적 변환의 예외

Array Decay의 암시적 변환에는 몇몇 예외가 있다.

1. `sizeof` 연산자로 배열의 크기를 구할 때: `sizeof(array)`
2. `&` 연산자로 배열의 주소를 구할 때: `ptr = &(array[i]);`
3. 문자 배열을 선언하면서 문자열로 초기화할 때: `char s[6] = "hello";`

참고: [Exceptions to Array Decay](https://stackoverflow.com/questions/17752978/exceptions-to-array-decaying-into-a-pointer)

## 번외: 코딩 스타일

함수의 인자로 배열을 넘길 때는 다음과 같이 매개변수 타입을 설정할 수 있다.

- `f(T array[]);`
- `f(T array[N]);`
- `f(T* array);`

모두 배열을 받을 수 있는 함수 선언이지만 필자는 포인터를 이용한 선언을 추천한다.

Array Decay로 인해 배열이 포인터로 붕괴함을 명시적으로 볼 수 있어 오해의 소지가 적기 때문이다.
