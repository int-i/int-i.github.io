---
title: "Python 3.8 기여운 바다코끼리를 드리겟슴미다 :="
date: 2020-05-29
author: Astro36
category: python
tags: [python, syntax]
---

파이썬 문법을 읽다, '바다코끼리 연산자'라고 불리는 기능을 발견했다.

찾아보니 2019년 10월에 정식 릴리즈된 파이썬 3.8에서 들어왔다고 하는데, 찾아보느라 이것저것 조사한 겸 정리해두면 좋을 것 같아 글을 남긴다.

## 바다코끼리 연산자

한국어로는 바다코끼리 연산자로 불리는 Walrus Operator는 [PEP 572](https://www.python.org/dev/peps/pep-0572/)에 Assignment Expressions이란 이름으로 정의되었다.

정식 명칭은 **대입 표현식**(Assignment Expression)이지만, 명명 표현식(Named Expression) 또는 **바다코끼리 연산자**(Walrus Operator)라고도 불린다.

<figure>
  <img src="/assets/posts/2020-05-29-python-walrus-operator/walrus.jpg" alt="Walrus" style="max-width: 256px;">
  <figcaption><code>:=</code>가 바다코끼리의 눈과 엄니를 닮아 바다코끼리 연산자라고 불리게 되었다.</figcaption>
</figure>

바다코끼리 연산자의 목적은 표현식(Expression)에 **이름을 부여**하고 **재사용**할 수 있게 하는 것이다.

지금까지 파이썬에서는 코드에서 표현식을 인라인(inline)으로 캡처하는 문법이 없었다.

예컨대, 파이썬 3.7 이하에서는 아래와 같이 코드를 작성해야 했다.

```py
a = [1, 2, 3, 4]
n = len(a)
if n > 5:
    print(f"List is too long ({n} elements, expected <= 5)")
```

`len`을 여러 번 호출하는 상황을 방지하기 위해, `len`의 출력값을 저장하는 변수 `n`을 사용하는데 라인 한 줄이 더 필요했다.

바다코끼리 연산자를 사용하면 아래와 같이 `n`을 **조건문 안에서 선언**하고 **값을 대입**할 수 있다.

```py
a = [1, 2, 3, 4]
if (n := len(a)) > 5:
    print(f"List is too long ({n} elements, expected <= 5)")
```

조건문 이외에도 다양한 곳에서 활용될 수 있다.

예를 들어 반복문에서는,

```py
while True:
    chunk = file.read(128)
    if chunk:
        break
    process(chunk)
```

위와 같은 코드를 아래처럼 바꿀 수 있다.

```py
while chunk := file.read(128):
    process(chunk)
```

또한, 표현식이기 때문에 리스트 안에서도 사용할 수 있다.

```py
y = f(x)
[y, y**2, y**3]
```

위와 같은 코드를 아래처럼 바꿀 수 있다.

```py
[y := f(x), y**2, y**3]
```

## 주의사항

바다코끼리 연산자는 식이 모호(Ambiguity)해질 수도 있기 때문에 **괄호**(Parentheses)와 함께 사용해야 한다.

단, 아래는 괄호를 사용하지 않아도 되는 **예외**이다.

```py
# 최상위의 if`문
if match := pattern.match(line):
    return match.group(1)

# 단순한 함수 호출
len(lines := f.readlines())
```

또한, 바다코끼리 연산자는 튜플(Tuple)에서 **대입 연산자**(`=`)와 다르게 동작한다.

```py
x = 1, 2  # x에 (1, 2)를 대입
(x := 1, 2)  # x에 1을 대입
```

## 결론

바다코끼리 연산자를 이용하면 기존의 코드를 좀 더 깔끔하게 짤 수 있다.

조건문과 반복문에서 식을 캡처하는 방식은 디버깅에도 유용하게 사용될 것으로 보인다.
