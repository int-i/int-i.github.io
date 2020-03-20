---
title: "Python에서 C/C++ 프로그램 사용하기 (with ctypes)"
date: 2020-03-20
author: Astro36
category: python
tags: [python, ctypes, ffi, c, cpp]
---

Python은 배우고 쉽고 생산성 높은 언어지만 너무나도 [느린 성능](https://benchmarksgame-team.pages.debian.net/benchmarksgame/fastest/python3-gcc.html)이 발목을 잡고는 합니다.
성능 문제를 극복하기 위해 일반적으로 많은 연산을 요구하는 부분을 C/C++로 작성하여 Python에 연결하는 방식을 사용합니다.
이 글에선 Python의 [ctypes](https://docs.python.org/3/library/ctypes.html) 모듈을 이용해 C/C++로 작성된 함수를 호출하는 방법을 알아볼 것입니다.

참고: [Python은 C보다 100배 느린가?](https://hagun.tistory.com/2822096)

## 시작

> 이 글은 Windows 10 - Visual Studio 환경을 기준으로 작성되었습니다.

비교군을 만들기 위해, 먼저 순수 Python으로 주어진 정수 `n`이 [소수](https://en.wikipedia.org/wiki/Prime_number)인지 확인하는 `is_prime` 함수를 작성합니다.

```py
import math

def is_prime(n):
    if n <= 1:
        return False
    elif n == 2:
        return True
    elif n % 2 == 0:
        return False
    sqrt_n = int(math.sqrt(n))
    for i in range(3, sqrt_n + 1):
        if n % i == 0:
            return False
    return True
```

그리고 `is_prime` 함수의 연산 성능을 측정하기 위한 코드를 작성합니다.

```py
import timeit

def test():
    is_prime(2147483647)

if __name__ == '__main__':  
    t = timeit.timeit(test, number=1000) # 1000번 실행에 걸리는 시간
    print(t)
```

이번에는 C 언어를 이용해 `is_prime` 함수를 작성해보도록 하겠습니다.

```c
#include <math.h>

__declspec(dllexport) _Bool is_prime(int n) {
    if (n <= 1) {
        return 0;
    } else if (n == 2) {
        return 1;
    } else if (n % 2 == 0) {
        return 0;
    }
    int sqrt_n = (int) sqrt(n);
    for (int i = 3; i <= sqrt_n; i += 1) {
        if (n % i == 0) {
            return 0;
        }
    }
    return 1;
}
```

> [`__declspec(dllexport)`](https://docs.microsoft.com/ko-kr/cpp/cpp/dllexport-dllimport) 구문은 DLL에서 함수를 내보내기 위한 키워드입니다.

위 코드를 Shared Library로 빌드해 `prime.dll` 파일을 만들어줍니다.

> `_Bool`을 사용하기 위해서는 C99 이상 버전으로 컴파일해야 합니다.

> C++로 함수를 작성하는 경우에는 아래와 같이 `extern "C"`를 이용해 C 함수 이름 규약으로 바꿔줘야 합니다.
>
> ```cpp
> bool is_prime_cpp(int n) {
> ...
> }
>
> extern "C" {
>     __declspec(dllexport) _BOOL is_prime(int n) {
>         return is_prime_cpp(n);
>     }
> }
> ```

## 로드

이제 C 언어로 작성된 라이브러리가 준비되었으니 파이썬에서 사용해보겠습니다.
`ctypes`는 파이썬용 외부 함수 라이브러리로 C 호환 데이터형을 제공하며, DLL 또는 공유 라이브러리에 있는 함수를 호출할 수 있습니다.

`ctypes`에서는 아래와 같이 `*.dll` 파일을 로드(load)합니다.

```py
import ctypes

libc = ctypes.CDLL('./prime.dll')
```

> `OSError: [WinError 193] %1은(는) 올바른 Win32 응용 프로그램이 아닙니다` 오류가 발생하면 아래와 같이 Python의 설치 비트를 확인해주세요.
>
> ```py
> import platform
> print(platform.architecture()) # ('64bit', 'WindowsPE')
> ```
>
> 만약, 64비트라면 `*.dll`도 64비트로 컴파일해야 합니다.

그리고 함수의 인자와 반환 타입을 정의해줍니다.

```py
libc.is_prime.argtypes = [ctypes.c_int]
libc.is_prime.restype = ctypes.c_bool
```

참고: [ctypes - Fundamental data types](https://docs.python.org/3/library/ctypes.html#fundamental-data-types)

마지막으로 아래와 같이 `libc.is_prime` 함수의 성능을 측정하기 위한 코드를 작성합니다.

```py
import timeit

def test():
    libc.is_prime(2147483647)

if __name__ == '__main__':  
    t = timeit.timeit(test, number=1000) # 1000번 실행에 걸리는 시간
    print(t)
```

## 비교

| `is_prime` | `libc.is_prime` |
| ---------- | --------------- |
| 4.9s       | 0.11s           |

순수 Python으로 구현된 `is_prime`은 1000번 실행되는데 약 4.9초가 걸리는 반면, C 언어로 구현된 `libc.is_prime`는 약 0.11초로 약 45배나 빠르게 동작하는 것을 확인할 수 있었습니다.

## 결론

실험을 통해 파이썬 코드를 C언어로 작성해 사용하면 연산 성능이 개선되는 것을 확인했습니다.

주의해야 할 점은, 연산 집약적인 코드에 한해 성능이 개선되는 것이며 동적라이브러리 함수 호출을 남용하게 된다면 호출과정에서 생기는 딜레이로 인해 오히려 성능이 떨어질 수 있음을 알아야 합니다.

## 첨부

- [prime.c](/assets/posts/2020-03-20-python-ctypes/prime.c)
- [prime-ffi.py](/assets/posts/2020-03-20-python-ctypes/prime-ffi.py): `libc.is_prime`
- [prime-pure.py](/assets/posts/2020-03-20-python-ctypes/prime-pure.py): `is_prime`
