---
title: "C++20 반복자를 이용한 정렬 알고리즘 구현 1: 삽입, 선택, 버블"
date: 2021-10-24
author: Astro36
category: cpp
tags: [cpp, template, iterator, algorithm, sorting]
thumbnail: /assets/posts/2021-10-24-cpp-iterator-sorting/thumbnail.jpg
---

정렬 알고리즘이란 컴퓨터 과학에서 **주어진 원소**들을 **일정한 순서대로 열거**하는 알고리즘이다.

정렬 알고리즘에는 다양한 종류가 있지만, 그중 몇 가지만 **C++20 반복자**를 이용해 구현해 볼 것이다.

반복자(Iterator)란 배열이나 리스트 등의 자료 구조에서 내부의 요소를 순회하는 객체이다.

참고: [[C++] 반복자 (Iterator)](https://eehoeskrap.tistory.com/m/263)

## 시작하기

우선 함수를 정의될 네임스페이스(namespace)를 정의하자.

```cpp
namespace sort {
} // namespace sort
```

그리고 [`ranges::sort`](https://en.cppreference.com/w/cpp/algorithm/ranges/sort) 함수를 참고해서 기본적인 정렬 함수를 만들어보자.

```cpp
#include <algorithm>
#include <functional>
#include <iterator>

namespace sort {
    template<std::random_access_iterator I,
             std::sentinel_for<I> S,
             typename Compare = std::less<>>
    void xxx_sort(I first, S last, Compare cmp = Compare{}) {
        // unimplemented
    }
} // namespace sort
```

[`std::random_access_iterator`](https://en.cppreference.com/w/cpp/iterator/random_access_iterator)는 `a[n]` 형태로 **임의 위치의 원소**에 접근할 수 있는 자료구조를 말한다.

C 언어의 배열, `std::array`, `std::vector` 등이 여기에 포함된다.

[`std::sentinel_for`](https://en.cppreference.com/w/cpp/iterator/sentinel_for)는 **반복자의 범위**를 나타내는 타입이다.

`std::vector` 값의 `v.end()` 값 등이 해당된다.

`typename Compare = std::less<>`는 **원소간의 비교 방법**을 나타내는 함수로, 기본적으로는 **오름차순 정렬**이기 때문에 `std::less`를 기본값으로 해놓았다.

정리하자면, 위의 `xxx_sort`는 `sort::xxx_sort(v.begin(), v.end());` 형태로 사용할 수 있다.

> `I`와 `S`를 `typename`으로 뭉개지 않고 **구체적인 타입으로 정의**한 이유는, 정렬이 불가능한 자료구조가 입력으로 들어 왔을 때 **컴파일 에러**를 발생시켜 예상치 못한 버그를 예방하기 위한 목적입니다.

## 삽입 정렬

![삽입 정렬](https://upload.wikimedia.org/wikipedia/commons/2/25/Insertion_sort_animation.gif)

> 출처: 위키백과

삽입 정렬(Insertion Sort)은 자료의 모든 원소를 앞에서부터 차례대로 이미 **정렬된 앞 부분과 비교**하며 자신의 위치를 찾아 **삽입**하는 알고리즘이다.

```cpp
namespace sort {
    template<std::random_access_iterator I,
             std::sentinel_for<I> S,
             typename Compare = std::less<>>
    void insertion_sort(I first, S last, Compare cmp = Compare{}) {
        for (auto it = first; it < last; ++it) {
            std::rotate(std::upper_bound(first, it, *it, cmp), it, it + 1);
        }
    }
} // namespace sort
```

코드를 보면 상당히 간결하게 구현한 것을 볼 수 있다.

[`std::upper_bound`](https://en.cppreference.com/w/cpp/algorithm/upper_bound)는 정렬된 자료에서 **주어진 값보다 큰 첫 번째 원소**를 반환한다.

`std::upper_bound`는 정렬된 자료에서 **이진 탐색(Binary Search)을 이용**하기 때문에 빠르게 동작한다.

[`std::rotate`](https://en.cppreference.com/w/cpp/algorithm/rotate)는 주어진 배열을 n 칸씩 당기거나 미는 함수이다.

위의 삽입 정렬 코드는 `std::upper_bound`를 이용해 현재 원소(`*it`)의 위치를 찾고, `std::upper_bound`으로 배열을 한 칸씩 밀면서 삽입하는 구조이다.

## 선택 정렬

![선택 정렬](https://upload.wikimedia.org/wikipedia/commons/b/b0/Selection_sort_animation.gif)

> 출처: 위키백과

선택 정렬(Selection Sort)은 주어진 자료에서 **최솟값**을 찾아 정렬되지 않은 배열의 **맨 앞 원소와 교환**하는 방식으로 정렬을 수행하는 알고리즘이다.

```cpp
namespace sort {
    template<std::random_access_iterator I,
             std::sentinel_for<I> S,
             typename Compare = std::less<>>
    void selection_sort(I first, S last, Compare cmp = Compare{}) {
        for (auto it = first; it < last; ++it) {
            std::iter_swap(std::min_element(it, last, cmp), it);
        }
    }
} // namespace sort
```

[`std::min_element`](https://en.cppreference.com/w/cpp/algorithm/min_element)은 주어진 배열에서 **최솟값**을 구하는 함수이다.

[`std::iter_swap`](https://en.cppreference.com/w/cpp/algorithm/iter_swap)는 반복자 끼리 **원소를 교환**하는 함수이다.

위의 선택 정렬 코드는 **최소 원소**를 찾아서 **앞에서부터 원소를 교환**하는 것을 반복하는 구조이다.

## 버블 정렬

![버블 정렬](https://upload.wikimedia.org/wikipedia/commons/3/37/Bubble_sort_animation.gif)

버블 정렬(Bubble Sort)은 **인접한 두 원소를 비교**하며 정렬하는 알고리즘으로, 원소의 이동이 **거품이 수면으로 올라오는 듯한 모습**을 보이기 때문에 지어진 이름이다.

```cpp
namespace sort {
    template<std::random_access_iterator I,
             std::sentinel_for<I> S,
             typename Compare = std::less<>>
    void bubble_sort(I first, S last, Compare cmp = Compare{}) {
        for (auto i = first; i < last; ++i) {
            for (auto j = i + 1; j < last; ++j) {
                if (cmp(*j, *i)) {
                    std::iter_swap(i, j);
                }
            }
        }
    }
} // namespace sort
```

`std::iter_swap`를 이용한다는 점이 선택 정렬과 유사하며, **2중 반복문**을 이용해 구현한다.

현재 원소와 그 다음 원소들 중 `cmp` (비교 함수)를 만족하는 **원소를 계속 비교해가며 정렬**하는 구조이다.
