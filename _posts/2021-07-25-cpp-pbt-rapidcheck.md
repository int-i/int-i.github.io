---
title: "???: 내 이름은 PBT. 어설픈 건 용납 못해 (Feat. RapidCheck)"
date: 2021-07-25
author: Astro36
category: cpp
tags: [c, cpp, cmake, testing, pbt, property_based_testing, rapidcheck]
---

> PBT; Property-based Testing(속성 기반 테스팅)

프로그래머들은 **코드의 안정성을 검증**하기 위해 모듈과 함수에 대해 **단위 테스트(Unit Test)를 작성**합니다.

여기서 단위 테스트란 해당 모듈과 함수가 **의도한대로 작동**하는지 확인하는 코드입니다.

일반적으로 단위 테스트는 함수의 입력과 출력(기댓값)을 **미리 계산**해두고 실제 함수의 **출력값과 기댓값을 비교**하는 식으로 이루어집니다.

예를 들어, `long long factorial(int n)` 함수의 단위 테스트는 아래와 같이 구성됩니다.

```cpp
assert(factorial(1) == 1);
assert(factorial(3) == 6);
assert(factorial(5) == 120);
...
```

단순하지만 명확한 방식으로, `factorial` 함수 구현에 문제가 있다면 `assert`를 통해 **경고가 발생**할 것입니다.

하지만, 위 방법의 문제는 `assert`를 통해 검사하지 못한 **반례 경우**로 인해 함수가 잘 작동한다고 **착각**하는 경우로 인해 발생합니다.

역설적이게도, **함수의 구현이 잘못되었다면**(=구현에서 반례를 고려하지 않았다면), 테스트 케이스 역시 (반례를 고려하지 않고) **엉망으로 작성**하는 경우가 대다수일 것입니다.

> 예컨데 `factorial`의 반례 중 하나로, 내부 구현에 `long long`을 사용하지 않았다면 `factorial(15)`의 경우, `int`의 범위를 벗어나 정상적인 결과를 얻을 수 없을 것입니다.

이러한 문제를 해결하기 위해 나온 것이 **속성 기반 테스팅**(Property-based Testing)으로, 입력과 기댓값 대신 **입력과 출력의 속성을 검사**하는 개념입니다.

이때 속성(Property)은 **함수의 스펙**(Spec)과 동의어로 생각하면 편한데,

예를 들어, 배열의 정렬 함수 `sort`의 속성이란,

1. "정렬되기 이전 배열과 정렬된 이후의 배열의 원소의 종류가 같다"
2. "모든 배열의 앞 원소는 배열의 뒤 원소보다 작아야 한다"

가 됩니다.

```txt
set(before_sort) == set(after_sort)
&& for i in after_sort: after_sort[i] < after_sort[i+1]
```

## PBT with RapidCheck

[RapidCheck](https://github.com/emil-e/rapidcheck)는 **C++ 속성 기반 테스팅**을 위한 라이브러리로, **임의의 입력과 출력을 생성**해 정의한 함수의 속성을 검사합니다.

> RapidCheck는 내장 라이브러리가 아니므로, 프로젝트에 **직접 라이브러리를 추가**해야 합니다.

가장 기본적인 예제로, 문자열 검색 알고리즘의 경우를 보겠습니다.

```cpp
#include <string>
#include <rapidcheck.h>

int string_search(const std::string &haystack, const std::string &needle) {
    return haystack.find(needle);
}

int main() {
    rc::check("should always contain itself",
              [](const std::string &s0) {
                  RC_ASSERT(string_search(s0, s0) == 0);
              });
    rc::check("should always contain its substrings",
              [](const std::string &s0, const std::string &s1, const std::string &s2) {
                  const std::string s = s0 + s1 + s2;
                  int idx = string_search(s, s1);
                  for (int i = 0; i < s1.length(); i++) {
                      RC_ASSERT(s1[i] == s[idx++]);
                  }
              });
    return 0;
}
```

`string_search`는 `haystack` 문자열에 `needle` 문자열 위치를 반환하는 함수입니다.

`string_search`의 속성은,

1. "자기자신을 검색할 때는 항상 0번째 위치이므로 0을 출력" 
2. "함수가 출력한 위치부터 시작하는 문자열과 `needle` 문자열의 일치"

입니다.

먼저 RapidCheck 헤더 `#include <rapidcheck.h>`를 추가하고,

`rc::check(description, testable)`를 통해 **검사할 함수 속성을 정의**합니다.

`description`에는 테스트에 대한 **간단한 설명**을 작성하고, `testable`에는 **테스트할 속성이 정의된 함수**를 작성합니다.

`testable` 함수의 인자는 **무작위 값을 가지는 데이터**로, [이곳](https://github.com/emil-e/rapidcheck/blob/master/doc/generators.md#arbitrary)을 참고하면 자세한 정보를 얻을 수 있습니다.

`RC_ASSERT`는 `assert`와 동일한 기능으로, 조건이 만족되지 않는다면 **경고를 발생**시키고 테스트를 종료합니다.

### Stateful PBT

아래 `Counter` 클래스와 같이 **내부적인 값을 가지고 있는 모듈**을 테스트할 때는 **상태 유지 속성 기반 테스팅**(Stateful Property-based Testing)이 필요합니다.

```cpp
#include <rapidcheck.h>
#include <rapidcheck/state.h>

class Counter {
public:
    void increase() {
        value++;
    }

    void decrease() {
        if (value > 0) {
            value--;
        }
    }

    int get() {
        return value;
    }

private:
    int value = 0;
};

struct CounterModel {
    int value = 0;
};

struct Increase : public rc::state::Command<CounterModel, Counter> {
    void apply(CounterModel &state) const override {
        state.value++;
    }

    void run(const CounterModel &state, Counter &counter) const override {
        counter.increase();
        RC_ASSERT(counter.get() == (state.value + 1));
    }
};

struct Decrease : public rc::state::Command<CounterModel, Counter> {
    void checkPreconditions(const CounterModel &state) const override {
        RC_PRE(state.value > 0);
    }

    void apply(CounterModel &state) const override {
        state.value--;
    }

    void run(const CounterModel &state, Counter &counter) const override {
        counter.decrease();
        RC_ASSERT(counter.get() == (state.value - 1));
    }
};

int main() {
    rc::check([] {
        CounterModel state;
        Counter sut;
        rc::state::check(state, sut, rc::state::gen::execOneOfWithArgs<Increase, Decrease>());
    });
    return 0;
}
```

먼저 Stateful PBT에 필요한 함수를 가지고 있는 `#include <rapidcheck/state.h>`를 추가합니다.

`rc::state`는 **테스트 대상의 상태 모델을 구현**하기 위해 필요한 모듈로,

위 코드에서는 `CounterModel`가 **상태 모델**이며, `rc::state::Command`를 상속받아 **모델의 작동(Operation) 속성**을 검사합니다.

> 위 코드에서 SUT는 System under Test의 약자로, 테스트할 대상을 의미합니다.
>
> 참고: [유닛테스트 코드의 변수명 sut의 정체](https://junho85.pe.kr/m/1891)

`apply`에는 **모델의 상태를 변경**하는 코드가 들어가고, `run`에는 **테스트 대상과 모델의 상태가 일치**한지 확인하는 코드를 작성합니다.

`checkPreconditions`과 `RC_PRE`는 앞서 무작위의 값을 입력해 함수의 속성을 확인한다고 했는데, 생성되는 **무작위의 값에 제약**을 걸어주는 역할입니다.

> 위 코드에선 `Counter`가 0 이하면 `decrease`가 작동하지 않으니 **0 이하인 경우는 테스트하지 않게 설정**한 것입니다.

마지막으로 `rc::state::gen::execOneOfWithArgs`는 **주어진 작동(Operation) 중 무작위로 하나를 선택해 실행**하는 함수입니다. (ex. Increase->Decrease->Decrease->Increase->...)

참고: [RapidCheck - User Guide](https://github.com/emil-e/rapidcheck/blob/master/doc/user_guide.md)

참고: [이 글에서 사용된 코드](https://github.com/int-i/cpp-pbt-example)

## 결론

여기까지 속성 기반 테스팅의 소개와 RapidCheck를 통해 테스트를 작성하는 방법을 알아봤습니다.

속성 기반 테스팅은 개념은 어렵지만, 잘 사용하며 매우 강력한 도구가 되어 **사람이 쉽게 생각하지 못하는 반례**들은 잡아내기 편리합니다.

그렇기에 여러분들도 이번 기회에 한 번 찍먹해보시길 추천드립니다.

---

3줄 요약

1. PBT는 예제 대신 스펙이 필요함.
2. 테스트는 스펙으로 알아서 만듬.
3. 버그 잡기 개좋음.
