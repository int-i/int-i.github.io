---
title: "C++20 반복자를 이용한 정렬 알고리즘 구현 2: 합병, 퀵, 힙"
date: 2021-10-31
author: Astro36
category: cpp
tags: [cpp, template, iterator, algorithm, sorting]
thumbnail: /assets/posts/2021-10-31-cpp-iterator-sorting/thumbnail.jpg
---

[C++20 반복자를 이용한 정렬 알고리즘 구현 1: 삽입, 선택, 버블](https://int-i.github.io/cpp/2021-10-24/cpp-iterator-sorting/)과 이어지는 글입니다.

이번에는 전에 소개한 정렬 알고리즘보다 더 빠르게 동작하는 알고리즘을 알아 볼 것입니다.

## 합병 정렬

![합병 정렬](https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Merge-sort-example-300px.gif/220px-Merge-sort-example-300px.gif)

> 출처: 위키백과

합병 정렬(Merge Sort)는 **분할 정복 기법**을 이용해 정렬하는 알고리즘입니다.

```cpp
namespace sort {
    template<std::random_access_iterator I,
             std::sentinel_for<I> S,
             typename Compare = std::less<>>
    void merge_sort(I first, S last, Compare cmp = Compare{}) {
        if (last - first > 1) {
            auto middle = first + (last - first) / 2;
            merge_sort(first, middle, cmp);
            merge_sort(middle, last, cmp);
            std::inplace_merge(first, middle, last, cmp);
        }
    }
} // namespace sort
```

합병 정렬은 구간을 **두 개의 구간으로 나눠** 각각 **합병 정렬을 재귀**적으로 수행하고, 두 구간을 하나로 합치며 정렬을 수행합니다.

반복자(Iterator) 간의 뺄셈(`-`) 연산은 **반복자 사이의 거리(Distance)를 반환**합니다.

즉, `last - first`은 구간 안의 **원소의 갯수**를 의미합니다. 

[`std::inplace_merge`](https://en.cppreference.com/w/cpp/algorithm/inplace_merge)는 **정렬된 두 구간을 하나로 합**치는 함수입니다.

## 퀵 정렬

![퀵 정렬](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Sorting_quicksort_anim.gif/220px-Sorting_quicksort_anim.gif)

> 출처: 위키백과

퀵 정렬(Quick Sort)은 **원소 하나를 기준(Pivot)으로 잡고**, 기준 보다 큰 원소와 작은 원소로 나누며 정렬을 수행하는 알고리즘입니다.

```cpp
namespace sort {
    template<std::random_access_iterator I,
             std::sentinel_for<I> S,
             typename Compare = std::less<>>
    void quick_sort(I first, S last, Compare cmp = Compare{}) {
        if (last - first > 1) {
            auto pivot = *(first + (last - first) / 2);
            auto middle1 = std::partition(first, last, [cmp, pivot](const auto &element) {
                return cmp(element, pivot);
            });
            auto middle2 = std::partition(middle1, last, [cmp, pivot](const auto &element) {
                return !cmp(pivot, element);
            });
            quick_sort(first, middle1, cmp);
            quick_sort(middle2, last, cmp);
        }
    }
} // namespace sort
```

`pivot`은 합병 정렬의 `middle`에 `*`가 붙은 형태로, 반복자의 **실질적인 값**을 의미합니다.

[`std::partition`](https://en.cppreference.com/w/cpp/algorithm/partition)은 조건에 **참(True)인 원소가 거짓(False)인 원소 앞에 오도록 재배치**하고 그 기준을 반환합니다.

재배치하는 과정에서 원소들이 자동으로 정렬되는 것이 아니기 때문에, 두 번의 `partition`이 필요합니다.

## 힙 정렬

![힙 정렬](https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Sorting_heapsort_anim.gif/220px-Sorting_heapsort_anim.gif)

> 출처: 위키백과

힙 정렬(Heap Sort)은 **최대 힙 트리**를 먼저 구성하고, 힙 트리에서 최댓값을 빼면서 자료를 정렬하는 알고리즘입니다.

```cpp
namespace sort {
    template<std::random_access_iterator I,
             std::sentinel_for<I> S,
             typename Compare = std::less<>>
    void heap_sort(I first, S last, Compare cmp = Compare{}) {
        std::make_heap(first, last, cmp);
        while (first != last) {
            std::pop_heap(first, last--, cmp);
        }
    }
} // namespace sort
```

[`std::make_heap`](https://en.cppreference.com/w/cpp/algorithm/make_heap)를 이용하면 주어진 구간의 원소를 **최대 힙 트리 배열** 형태로 재배치 할 수 있습니다.

재배치된 구간에서 [`std::pop_heap`](https://en.cppreference.com/w/cpp/algorithm/pop_heap)를 이용해 **최댓값을 구간의 맨 뒤로 보내는 것을 반복**하는 구간의 원소가 정렬됩니다.

## 알고리즘 속도 비교

![정렬 알고리즘 속도](/assets/posts/2021-10-31-cpp-iterator-sorting/benchmark.jpg)

합병 정렬, 퀵 정렬, 힙 정렬이 **전반적으로 빠른 속도**를 보였고, **배열의 크기가 작을 때** 삽입 정렬도 매우 빠르게 동작하는 것을 확인할 수 있었습니다.
