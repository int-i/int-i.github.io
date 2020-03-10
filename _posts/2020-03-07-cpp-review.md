---
title: "C++ 문법 복습하기"
date: 2020-03-07
author: Astro36
category: cpp
tags: [cpp, syntax, review]
---

이 글은 작년 한 해 동안 배운 C++ 문법을 요약 정리한 문서입니다. C++만의 고유한 특징과 더 나은 코드를 작성하기 위해 같이 알아두면 좋은 내용 위주로 정리했습니다 `if`, `for`과 같이 타 언어에도 공통으로 존재하는 문법은 생략되었으니 기초적인 부분이 필요하시면 강의노트와 함께 복습하시기를 권장합니다.

## 변수와 상수

C++에서는 `{type} {identifier}` 형태로 변수를 선언 할 수 있습니다.

```cpp
int i; // 변수 선언
i = 42; // `i`에 42를 할당
```

위 코드는 아래와 같이 한 줄로 작성할 수 있습니다.

```cpp
int i = 42;
```

만약 값을 이용해 자동으로 변수의 타입을 지정하고 싶다면 `auto`를 이용할 수 있습니다.

```cpp
auto i = 42;
```

참고: [C++ auto](https://boycoding.tistory.com/184)

`int`, `long`과 같이 범위만 다른 숫자 자료형을 서로 구분하기 위해서는 리터럴(literal)를 사용합니다.

```cpp
int i = 10;
long l = 100L;
float f = 3.14f;
double d = 6.02e23;
```

참고: [C++ Literal](https://boycoding.tistory.com/155)

만약 값을 수정 할 수 없는 상수를 선언하고 싶다면 `const` 키워드를 이용할 수 있습니다. `const`는 타입 앞과 뒤 어디에나 올 수 있습니다. 아래 두 식은 완전히 동일한 코드입니다.

```cpp
const int i = 42;
int const i = 42;
```

> C++에서 `#define`을 이용한 상수 선언은 변수의 타입 검사가 불가능하기 때문에 지양하는 방식입니다. 상수값이 컴파일시간 내에 확정됨을 보증해야 한다면 `constexpr` 사용을 고려해보세요.
>
> ```cpp
> constexpr int i = 42;
> ```

포인터는 변수의 메모리 주소를 가리킵니다. 아래와 같이 포인터를 선언하고 값을 사용할 수 있습니다.

```cpp
int age = 20;
int* age_ptr = &age; // address: 0xabcdef
int age_val = *age_ptr; // value: 20
```

포인터 역시 상수형 포인터(Const pointer)가 존재합니다.

```cpp
int val = 10;
int another_val = 100;
int* const ptr = &val;
ptr = &another_val; // ERROR
*ptr = 20; // OK
```

상수형 포인터는 포인터가 가리키는 주소를 변경할 수 없는 포인터를 말합니다. 이는 단순히 상수를 가리키는 포인터(Pointer to const value)와 구분해야 합니다.

```cpp
int val = 10;
int another_val = 100;
const int* ptr = &val;
ptr = &another_val; // OK
*ptr = 20; // ERROR
```

참고: [C++ Const Pointer](https://boycoding.tistory.com/206)

> 권장하지 않는 문법이긴 하나, `const_cast`를 이용하면 상수 역시 수정할 수 있습니다.
>
> ```cpp
> #include <iostream>
>
> const volatile int i = 10;
> auto ptr_const = &i;
> ptr_const = 100; // ERROR
> auto ptr_nonconst = const_cast<int*>(&i);
> *ptr_nonconst = 100; // OK
> std::cout << i << std::endl; // 100
> ```
>
> `volatile`은 코드의 최적화를 금지하는 문법으로, `const`는 컴파일러의 판단하에 `#define`처럼 컴파일시간에 상수로 치환될 수 있기에 치환을 금지하는 용도로 사용되었습니다. `volatile`를 사용하지 않았다면 `std::cout << 100 << std::endl;`와 같이 코드가 치환되어 생성되기 때문에 상수가 수정됨을 보일 수 없었을 것입니다.

만약 프로그래머가 값을 메모리에 동적할당하고 싶다면 `new` 키워드를 이용할 수 있습니다.

```cpp
int* ptr = new int;
*ptr = 10;
```

동적할당된 메모리는 `delete` 키워드를 이용해 메모리를 수거해주어야 합니다.

```cpp
int* ptr = new int;
*ptr = 10;
delete ptr; // 메모리 해지
ptr = NULL; // `ptr` 저장된 주소값을 삭제
```

`NULL`은 `0`과 완전히 동일합니다. (`#define NULL 0`으로 정의되어 있음) 따라서 아래와 같이 주소를 지워도 무방합니다.

```cpp
ptr = 0;
```

> C++에서 `NULL`이 `0`과 동일하기 때문에 발생하는 여러 문제를 해결하기 위해 널 포인터만을 위한 키워드 `nullptr` 사용을 권장합니다.

`delete`는 자동으로 해당 포인터가 `NULL`인지 확인하기 때문에 아래와 같은 코드는 불필요한 코드입니다.

```cpp
if (ptr != NULL) {
    delete ptr;
}
```

> C++에서는 동적할당된 메모리는 반드시 `delete`로 해지해야 하지만 이 과정에서 많은 실수가 발생하기에, C++ Core Guidelines은 동적할당이 필요한 경우에 스마트포인터 사용을 권장합니다.
>
> ```cpp
> auto ptr0 = std::make_unique<int>();
> auto ptr1 = std::make_shared<int>();
> ```

## 함수

아래와 같이 함수를 선언할 수 있습니다.

```cpp
int sum(int a, int b) {
    return a + b;
}
```

함수의 반환타입 역시 `auto`를 이용해 추론할 수 있습니다. 하지만 매개변수에는 `auto`를 사용할 수 없습니다.

```cpp
auto sum(int a, int b) {
    return a + b;
}
```

C++에서는 아래가 표준적인 `main` 함수 정의입니다.

```cpp
int main() {
    return 0;
}

int main(int argc, char *argv[]) {
    return 0;
}
```

참고: [C++ Main Function](https://en.cppreference.com/w/cpp/language/main_function)

## 배열

아래는 값이 연속적인 메모리 공간에 할당되는 배열(array)를 선언하는 방법입니다.

```cpp
int array[5] = { 1, 2, 3, 4, 5 };
```

변수의 크기를 가져오는 `sizeof` 연산자를 이용해 배열의 길이를 알아낼 수 있습니다.  `std::size_t`는 어떤 객체나 값이 포함할 수 있는 최대 크기의 데이터를 표현하는 타입입니다.

```cpp
int array[5] = { 1, 2, 3, 4, 5 };
std::size_t size = sizeof(array) / sizeof(array[0]); // 5
```

> C++ Core Guidelines에서는 내장된 고정 배열 문법 대신 `std::array` 사용을 권장하고 있습니다.
>
> ```cpp
> #include <array>
>
> std::array<int, 5> modern_array { 1, 2, 3, 4, 5 };
> auto size = modern_array.size(); // 5
> ```

배열은 첨자연산자(`[]`)를 이용해 배열 요소에 접근할 수 있습니다.

```cpp
int array[5] = { 1, 2, 3, 4, 5 };
int element0 = array[0]; // 1
```

배열은 포인터로도 표현될 수 있습니다. 이때 배열 포인터의 값은 배열의 첫 번째 요소의 주소값과 동일합니다.

아래는 함수의 매개변수로 배열을 넘기는 방식입니다.

```cpp
void array_fn0(int *array) {
}

void array_fn1(int array[5]) {
}

void array_fn0(int array[]) {
}
```

> C++ Core Guidelines에서는 함수의 매개변수로의 포인터 사용을 지양합니다. 포인터를 사용하면 함수의 매개변수로 배열이 들어갈 때 배열 크기 정보가 소멸합니다. 따라서 `std::span`을 이용해 배열을 넘기거나 `std::array`로 정의된 배열을 사용하는 것이 바람직합니다.
>
> 참고: [C++ Array to Pointer Decay](https://blog.seulgi.kim/2017/10/cpp-array-to-pointer-decay.html)

2차원 배열은 배열 안에 배열을 넣는 형태로 구현합니다.

```cpp
// static allocation
int matrix[5][5] = {
    { 0, 1, 2, 3, 4 },
    { 1, 2, 3, 4, 5 },
    { 2, 3, 4, 5, 6 },
    { 3, 4, 5, 6, 7 },
    { 4, 5, 6, 7, 8 }
};

// dynamic allocation
auto matrix_ptr = new int[5][5];
for (int r = 0; r < 5; r += 1) {
    for (int c = 0; c < 5; c += 1) {
        matrix_ptr[r][c] = r + c;
    }
}
```

동적할당된 배열을 해지할 때는 `delete[]`를 이용해야 합니다. `delete`를 사용할 경우, 첫 번째 요소만 해지됩니다.

```cpp
delete[] matrix_ptr;
```

## 구조체와 공용체

아래와 같이 구조체와 공용체를 선언할 수 있습니다.

```cpp
struct Point {
    int x;
    int y;
};

union Color {
    int hex;
    struct {
        int red;
        int green;
        int blue;
    } rgb;
};
```

> C++ Core Guidelines에서는 `union` 대신 `std::any`를 사용할 것을 권장합니다.

`union`을 남용하는 코드는 일반적으로 설계가 잘못된 것으로 보여지며, 상속과 열거형 등으로 고쳐 쓰는 것이 바람직합니다.

위의 `Point` 구조체와 같이 속성을 2개 가지는 구조체는 `std::pair`를 이용해 간결하게 작성할 수 있습니다.

```cpp
#include <utility>

std::pair<int, int> point = std::make_pair(1, 2);
int x = point.first; // 1
int y = point.second; // 2
```

> 구조체의 속성은 모두 `public`이며 구조체에 접근하는 함수를 구현하는 경우, 클래스로 정의하는 것을 고려해보세요.
>
> ```cpp
> #include <iostream>
> #include <string>
>
> // bad
> struct Person {
>     std::string name;
>     int age;
> };
>
> void print_person(const Person& person) {
>     std::cout << person.name << "(" << person.age << ")" << std::endl;
> }
>
> // good
> class Person {
> private:
>     std::string name;
>     int age;
>
> public:
>     Person(const std::string& name, int age)
>     : name(name), age(age) {}
>
>     void print() const {
>         std::cout << person.name << "(" << person.age << ")" << std::endl;
>     }
> };
> ```

## 클래스

아래와 같이 클래스를 선언할 수 있습니다.

```cpp
#include <iostream>

class Bird {
private:
    int age;

public:
    Bird(int age): age(age) {}
    virtual ~Bird() = default;

    void fly() const final {
        // TODO
    }

    virtual void sing() const {
        // TODO
    }
};

class Duck : public Bird {
private:
    int age;

public:
    Duck(int age): Bird(age) {}
    virtual ~Duck() = default;

    virtual void sing() const override {
        // TODO
    }
};
```

메소드(method) 뒤의 `const`는 메소드가 클래스를 수정하지 않고 값을 사용(query)함을 의미합니다.

`virtual` 함수는 동적 바인딩(Dynamic binding) 통해 런타임시 객체의 함수를 호출하게 합니다. 예를 들어, 동적 바인딩은 아래 코드의 `sing`이 `Bird::sing`이 아닌 `Duck::sing`을 호출할 수 있게 합니다.

```cpp
Bird* duck_ptr = new Duck(1);
duck_ptr->sing();
```

> Java의 클래스의 경우 모든 메소드가 virtual로 정의된 것과 같이 동작합니다.

`virtual`은 런타임시간에 함수호출이 결정되어 성능손실이 있으므로 남용하지 않게 주의합니다.

`final` 키워드는 해당 메소드가 더 이상 오버라이드(Override)할 수 없음을 명시적으로 표시합니다.

`override` 키워드는 해당 메소드가 오버라이드 되었음을 명시적으로 표시합니다. C++에서는 오버라이딩 규칙을 모두 만족해야 메소드가 오버라이딩 되는데 `override`는 이런 규칙을 컴파일시간에 검사하는 기능을 합니다.

참고: [C++ Override](https://ozt88.tistory.com/17)

생성자 뒤의 `:`은 생성자 초기화 리스트(Constructor member initializer list)입니다. C++의 경우 클래스 멤버변수 선언에 초기화 구문을 넣을 수 없는데 클래스는 형태만 정의해 놓은 것이지 아직 메모리 할당은 받은 것이 아니기 때문입니다. 그래서 객체가 생성될 때 초기화 리스트를 이용해 값을 초기화시켜줍니다.

### 초기화 리스트를 사용해야만 하는 경우

1. 멤버변수가 상수일 때:

    ```cpp
    class A {
    private:
        const int m;

    public:
        A(int n): m(n) {}
    };
    ```

    만약 `n`이 상수 리터럴이라면 아래와 같이 쓸 수 있습니다.

    ```cpp
    class A {
    private:
        const int m = 10;

    public:
        A() {}
    };
    ```

2. 멤버변수가 참조일 때:

    ```cpp
    class A {
    private:
        const std::string& m;

    public:
        A(const std::string& n): m(n) {}
    };
    ```

3. has-a 상속에서 내장 클래스를 초기화시킬 때:

    ```cpp
    class A {
    private:
        B b;

    public:
        A(): b(1, 2) {}
    };
    ```

4. is-a 상속에서 부모 클래스를 초기화시킬 때:

    ```cpp
    class B : public A {
    public:
        B(): A(1, 2) {}
    };
    ```

참고: [C++ Constructor Member Initializer List](https://blog.naver.com/krinlion/40138012756)

멤버변수와 매개변수의 이름이 같을 때도 초기화 리스트를 사용하지만, `this`를 이용하면 초기화 리스트 없이 값을 초기화할 수 있습니다. 따라서 이 경우는 초기화 리스트를 반드시 사용해야 하는 경우가 아닙니다. 

```cpp
class A {
private:
    int m;

public:
    A(int m) {
        this->m = m;
    }
};
```

이 밖에도 초기화 리스트는 변수의 불필요한 할당의 줄여 성능향상에도 도움이 됩니다. 아래 코드는 `m`에 총 2번의 할당이 발생합니다.

```cpp
class A {
private:
    int m;

public:
    A(int n) { // 생성자를 호출하기 전, `m`에 0 할당
        m = n; // `m`에 `n` 할당
    }
};
```

위를 초기화 리스트를 사용해 바꾼다면 한 번의 할당만으로 객체를 초기화할 수 있습니다.

```cpp
class A {
private:
    int m;

public:
    A(int n): m(n) {} // 생성자를 호출하기 전, `m`에 `n` 할당
};
```

`friend` 키워드를 이용하면 외부에서도 `private`, `protected`로 선언된 멤버변수에 접근할 수 있습니다. 이는 클래스의 캡슐화를 파괴하지만, 연산자를 오버로딩할 때 유용하게 사용됩니다.

```cpp
#include <iostream>

class Book {
    friend std::ostream& operator<<(std::ostream& out, const Book& book);

private:
    std::string title;

public:
    // TODO
};

std::ostream& operator<<(std::ostream& out, const Book& book) {
    out << book.title;
    return out;
}
```
