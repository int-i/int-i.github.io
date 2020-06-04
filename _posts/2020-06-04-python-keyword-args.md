---
title: "Python Keyword Arguments: 함수 인자에 이름을 붙여주세요"
date: 2020-06-04
author: Astro36
category: python
tags: [python, syntax]
---

파이썬에서는 함수를 호출할 때 함수의 인자에 **이름을 붙여 전달**할 수 있다.

이를 **Keyword Arguments**라 부른다.

이름을 붙여서 전달하는 인자는 인자의 순서에 구애받지 않고 값을 전달할 수 있으며 가독성을 향상시킨다.

## 기본

```py
def print_abc(a, b=-1, c=-1):
    print(f'a: {a}')
    print(f'b: {b}')
    print(f'c: {c}')
```

인자로 받은 `a`, `b`, `c`를 출력하는 `print_abc`를 이용해 아래 예시를 보자.

```py
print_abc(10, 20)
```

Output:

```text
a: 10
b: 20
c: -1
```

위는 함수 정의 명시된 인자의 순서를 이용해 값을 전달하는 Positional Arguments 방식을 이용한 예제이다.

Keyword Arguments는 아래와 같이 **인자의 순서를 무시**하고 값을 전달할 수 있다.

```py
print_abc(b=10, a=20)
```

Output:

```text
a: 20
b: 10
c: -1
```

10이 20보다 앞에 있지만, 결과를 보면 **순서에 상관없이** `a`와 `b`의 이름대로 값이 바뀐 것을 볼 수 있다.

또한, `a`와 `b`를 명시적으로 표시함으로써 코드를 볼 때 각 인자가 어떤 역할을 하는지 직관적으로 볼 수 있어 코드의 **가독성**을 높이는 데도 도움이 된다.

## 응용

Keyword Arguments는 함수 인자의 **기본값**을 활용할 때도 도움이 된다.

```py
print_abc(10, c=20)
```

Output:

```text
a: 10
b: -1
c: 20
```

`c`를 Keyword Arguments로 전달함으로써 `b`를 건너뛰고 값을 전달한다.
이때, `b`는 기본값인 -1이 할당된다.

## 가변인자 Keyword Arguments

Keyword Arguments 역시 인자의 개수가 정해지지 않은 **가변인자**로 사용할 수 있다.

```py
def print_all(**kwargs):
    for key in kwargs:
        print(f'key: {key}, value: {kwargs[key]}')

print_all(a=1)
print_all(a=10, b=20)
print_all(q=-1, w=-2, e=-3)
```

Output:

```text
key: a, value: 1
key: a, value: 10
key: b, value: 20
key: q, value: -1
key: w, value: -2
key: e, value: -3
```

위의 예제는 인자의 이름을 딕셔너리의 키(Key)로 값을 저장한 후, `for-in`을 이용해 딕셔너리의 값을 출력하는 예제이다.

여기서 `*`는 포인터의 의미가 아닌 `kwargs`가 **여러 개의 인자를 받을 수 있는 집합**이란 의미이다.

`*args`와 같이 `*`가 하나 있다면 Positional Arguments를 튜플(Tuple) 형태로 저장하고,

`**kwargs`와 같이 `*`가 2개라면 Keyword Arguments를 **딕셔너리(Dictionary)** 형태로 저장한다.

참고: [가변인자, 패킹, 언패킹](https://medium.com/@chrisjune_13837/python-가변인자-패킹-언패킹-a47ee2cdcac3)

## Keyword-Only Arguments

Keyword Arguments으로만 함수 인자를 전달할 수 있게 **강제**할 수도 있다.

함수 인자 자리에 `*`를 넣으면 된다.

```py
def print_abcd(a, b=-1, *, c=-1, d=-1):
    print(f'a: {a}')
    print(f'b: {b}')
    print(f'c: {c}')
    print(f'd: {d}')


print_abcd(1, 2, c=3)
```

Output:

```text
a: 1
b: 2
c: 3
d: -1
```

참고: [Keyword-Only Arguments](https://www.python.org/dev/peps/pep-3102/)

## 주의사항

Keyword Arguments는 Positional Arguments 앞에 올 수 없다.

즉, 아래와 같은 코드는 오류가 발생한다.

```py
print_abc(a=10, 20)
```

Output:

```text
File ".\test.py", line 7
    print_abc(a=10, 20)
                    ^
SyntaxError: positional argument follows keyword argument
```
