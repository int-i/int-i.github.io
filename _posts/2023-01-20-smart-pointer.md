---
title: "스마트 포인터: 저수준에서 가비지 컬렉션을 추구하면 안 되는 걸까"
date: 2023-01-20
author: Astro36
category: cpp
tags: [cpp, c, smart_pointer, raii, csptr, gcc, cleanup, macro, clang, intel, unique_ptr, shared_ptr, weak_ptr]
thumbnail: /assets/posts/2023-01-20-smart-pointer/thumbnail.jpg
---

**가비지 컬렉션**(Garbage Collection)은 **동적 할당**된 메모리 영역 가운데 더 이상 사용하지 않는 영역을 탐지하여 **자동으로 해제**하는 기능입니다.

**자바, C#, 파이썬** 등의 프로그래밍 언어들은 처음부터 **가비지 컬렉션** 기법을 염두에 두고 설계되어, 언어 자체에 가비지 컬렉션이 **포함**되어 있습니다.

반면, **C와 C++**은 프로그래머가 **직접 메모리를 관리**하는 언어로 설계되어, 언어 자체에 가비지 컬렉션이 포함되어 있지 않습니다.

하지만, C와 C++의 문법적 기능과 컴파일러 확장을 이용하면 가비지 컬렉션 기능을 비슷하게나마 흉내 낼 수 있습니다.

## C++에서의 스마트 포인터

C++의 **RAII(Resource Acquisition Is Initialization) 기법**을 이용하면 자동으로 사용하지 않는 메모리를 해지하는 **스마트 포인터**를 만들 수 있습니다.

```cpp
template<typename T>
class Box {
public:
    explicit Box(T *ptr)
    : ptr(ptr) {}

    T *get() const {
        return ptr;
    }

    ~Box() {
        delete[] ptr;
    }

private:
    T *ptr;
};
```

클래스의 **생성자**에서 포인터를 받아 멤버 변수에 저장하고, **소멸자**에서 저장한 포인터를 `delete`하면 됩니다. 

```cpp
void test_box() {
    Box<int> i{ new int };
    std::cout << i.get() << '\n';

    Box<int> a{ new int[100000000] };
    std::cout << a.get() << '\n';
}
```

`test_box` 함수가 종료될 때, 함수 내부에서 생성된 **객체들의 소멸자**가 **호출**되며 포인터가 자동으로 `delete`되는 원리입니다.

C++ **STL**에서는 이미 **스마트 포인터**에 대한 **구현을 제공**합니다.

- `std::unique_ptr`는 위의 Box 형태와 동일한 **기본적인 스마트 포인터**입니다.

    **복사가 불가능**하기 때문에 다른 변수로 포인터를 이동시켜야 할 때는 `std::move`를 이용해야 합니다. 

- `std::shared_ptr`: **여러 변수**가 **동일한 포인터**를 잡아둘 수 있는 스마트 포인터입니다.

    **하나의 변수**만 잡을 수 있는 `std::unique_ptr`와 달리, 여러 변수가 들고 있기 때문에 **RC(Reference Counting) 방식**을 이용합니다.

    따라서 RC로 인한 **성능 손실**이 발생합니다.

    또한 `std::shared_ptr`끼리 서로를 참조하는 **순환 참조**가 발생하면, 해당 메모리는 **영원히 해지되지 않는** 문제가 발생합니다.

- `std::weak_ptr`: `std::shared_ptr`간 **순환 참조**를 **막기** 위해 사용하는 스마트 포인터입니다.

    순환되는 `std::shared_ptr` 대신 들어가, 약한(=Weak =Non-owning) 참조를 이용해 **순환 참조를 끊어**줍니다.

## C에서의 스마트 포인터

**C언어**에는 **클래스 문법**이 존재하지 않기 때문에, **소멸자**를 이용한 **RAII**를 통해 **스마트 포인터**를 만들 수 없습니다.

하지만, **GNU C**의 **컴파일러 확장**을 이용하면 비슷한 흉내를 낼 수 있습니다.

```c
#define autofree __attribute__ ((cleanup(free_stack)))

__attribute__ ((always_inline))
inline void free_stack(void *ptr) {
    free(*(void **) ptr);
}
```

`cleanup` 속성(Attribute)은 변수가 스코프(Scope)를 벗어날 때, **주어진 함수를 호출**합니다.

참고: [GCC - Common Variable Attributes](https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html)

```c
int main(void) {
    autofree int *i = malloc(sizeof (int));
    *i = 1;
    return *i;
}
```

`malloc`으로 **동적 할당**된 `i`는 `main`이 종료될 때,

1. `__attribute__ ((cleanup(free_stack)))`에 의해 `free_stack` 함수를 **호출**하게 되고,
2. `free_stack` 안의 `free` 함수를 호출하여 자동으로 **해지**됩니다.

참고: [Implementing smart pointers for the C programming language](https://snai.pe/posts/c-smart-pointers)

[libcsptr](https://github.com/Snaipe/libcsptr)는 위 기법을 이용해 작성된 대표적인 **C 스마트 포인터 라이브러리**입니다.

그러나 C에서는 C++과 달리, 일반적으로 **스마트 포인터를 사용하지 않습니다.**

왜냐하면, `cleanup`이라는 **GNU C 기능**을 이용해 구현했기 때문에 **컴파일러**에 따라 동작하지 않는 경우가 있기 때문입니다.

대표적인 예로, **Visual Studio**의 기본 컴파일러인 **MSVC**에서는 `cleanup`을 **지원하지 않습니다.**

물론 Windows 사용자더라도 **Clang이나 Intel C 컴파일러** 등을 이용하면 아예 사용 불가능한 것은 아니나, **코드의 범용성**을 위해 특정 컴파일러에서만 작동하는 코드는 **지양**하는 것이 올바르다고 생각합니다.

따라서 **C언어**에서의 스마트 포인터는 **아예 불가능하지 않다**고만 기억하면 될 것 같습니다.
