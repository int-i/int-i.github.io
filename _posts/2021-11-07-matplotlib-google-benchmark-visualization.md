---
title: "Matplotlib을 이용한 Google Benchmark 결과 시각화"
date: 2021-11-07
author: Astro36
category: python
tags: [python, pypi, matplotlib, json, cpp, benchmark, visualization]
thumbnail: /assets/posts/2021-11-07-matplotlib-google-benchmark-visualization/thumbnail.jpg
---

[Matplotlib](https://matplotlib.org/)은 파이썬에서 **데이터 시각화**에 사용하는 대표적인 라이브러리입니다.

파이썬과 Matplotlib을 이용하면 쉽고 빠르게 원하는 **데이터를 그래프**로 나타낼 수 있습니다.

[Google Benchmark](https://github.com/google/benchmark)는 C++ **코드의 성능을 측정**하는 라이브러리로, 사용하면 아래와 같은 결과를 얻을 수 있습니다.

```txt
-----------------------------------------------------------------
Benchmark                       Time             CPU   Iterations
-----------------------------------------------------------------
BM_BubbleSort/1              3432 ns         3434 ns       203943
BM_BubbleSort/8              3643 ns         3643 ns       192168
BM_BubbleSort/64            15190 ns        15181 ns        46107
BM_BubbleSort/512          558533 ns       558107 ns         1254
BM_BubbleSort/4096       49870593 ns     49837304 ns           14
BM_BubbleSort/32768    3792011976 ns   3789209799 ns            1
BM_HeapSort/1                3444 ns         3446 ns       203316
BM_HeapSort/8                3692 ns         3696 ns       189640
BM_HeapSort/64               6986 ns         6984 ns       100220
BM_HeapSort/512             43565 ns        43501 ns        16099
BM_HeapSort/4096           418680 ns       418439 ns         1673
BM_HeapSort/32768         4894845 ns      4891226 ns          143
BM_InsertionSort/1           3426 ns         3430 ns       203730
BM_InsertionSort/8           3723 ns         3726 ns       189032
BM_InsertionSort/64          8438 ns         8435 ns        82914
BM_InsertionSort/512        82394 ns        82298 ns         8509
BM_InsertionSort/4096     2099952 ns      2098425 ns          334
BM_InsertionSort/32768  128825712 ns    128714670 ns            5
BM_MergeSort/1               3440 ns         3444 ns       203974
BM_MergeSort/8               4269 ns         4270 ns       163778
BM_MergeSort/64             12766 ns        12763 ns        54769
BM_MergeSort/512            94096 ns        94026 ns         7445
BM_MergeSort/4096          851189 ns       850581 ns          822
BM_MergeSort/32768        7766578 ns      7758767 ns           90
BM_QuickSort/1               3442 ns         3445 ns       204311
BM_QuickSort/8               3755 ns         3757 ns       186077
BM_QuickSort/64              8495 ns         8491 ns        82482
BM_QuickSort/512            59769 ns        59692 ns        11751
BM_QuickSort/4096          579835 ns       579384 ns         1208
BM_QuickSort/32768        5575984 ns      5571140 ns          126
BM_SelectionSort/1           3450 ns         3453 ns       203011
BM_SelectionSort/8           3554 ns         3558 ns       197000
BM_SelectionSort/64          8427 ns         8422 ns        83086
BM_SelectionSort/512       273484 ns       273251 ns         2562
BM_SelectionSort/4096    17377663 ns     17363755 ns           40
BM_SelectionSort/32768 1101676702 ns   1100820273 ns            1
```

> [C++ Sort](https://github.com/int-i/cpp-sort) 함수의 성능 비교 표

Google Benchmark로는 표로 된 결과를 얻을 수 있습니다.

이것을 **배열 크기-실행 시간 그래프**로 나타내면 어떤 알고리즘이 효율적인지 한눈에 파악하기 쉬울 것입니다.

위와 같은 표 형태보다 **JSON 형태가 파싱이 편리**하기 때문에, 우선 Benchmark 결과를 **JSON으로 출력**해봅시다.

> 파싱(Parsing)은 어떤 데이터에서 **원하는 데이터를 특정 패턴이나 순서로 추출**해 가공하는 것을 말합니다.

Google Benchmark에서는 `BENCHMARK_FORMAT`와 `BENCHMARK_OUT`을 이용해 **출력되는 포맷(Format)과 파일**을 지정할 수 있습니다.

Benchmark 파일을 실행할 때, **환경변수**로 넣어줍니다.

```txt
$ BENCHMARK_FORMAT=json BENCHMARK_OUT=benchmark.json build/benchmarks/benchmark_sort
```

실행이 끝나면, 결과는 JSON으로 `benchmark.json`(`BENCHMARK_OUT`)에 출력됩니다.

`benchmark.json`:

```json
{
  "context": {
    "date": "2021-11-07T11:54:01+09:00",
    "host_name": "ubuntu",
    "executable": "build/benchmarks/benchmark_sort",
    "num_cpus": 4,
    "mhz_per_cpu": 1500,
    "cpu_scaling_enabled": true,
    "caches": [
    ],
    "load_avg": [0,0,0],
    "library_build_type": "release"
  },
  "benchmarks": [
    {
      "name": "BM_BubbleSort/1",
      "run_name": "BM_BubbleSort/1",
      "run_type": "iteration",
      "repetitions": 0,
      "repetition_index": 0,
      "threads": 1,
      "iterations": 204332,
      "real_time": 3.4235093321168374e+03,
      "cpu_time": 3.4276080741147057e+03,
      "time_unit": "ns"
    },
    {
      "name": "BM_BubbleSort/8",
      "run_name": "BM_BubbleSort/8",
      "run_type": "iteration",
      "repetitions": 0,
      "repetition_index": 0,
      "threads": 1,
      "iterations": 190606,
      "real_time": 3.6746951781538737e+03,
      "cpu_time": 3.6777019348813947e+03,
      "time_unit": "ns"
    },
    ...
  ]
}
```

이제 JSON 파일을 읽어봅시다.

```py
with open('benchmark.json') as file:
    benchmark_result = json.load(file)
    benchmarks = benchmark_result['benchmarks']
```

JSON 파일에서 그래프에서 사용될 **레이블(Label)과 X축(배열 크기)를 추출**하는 함수를 정의합니다.

이때, X축을 1, 8, 64, 512, ... 형태로 커지게 하기 위해 **문자열(`str`) 타입으로 정의**합니다.

```py
def extract_label_from_benchmark(benchmark):
    benchmark_name = benchmark['name']
    return benchmark_name.split('/')[0][3:]  # erase `BM_`

def extract_size_from_benchmark(benchmark):
    benchmark_name = benchmark['name']
    return benchmark_name.split('/')[1]  # not int, for exp scale x axis
```

`itertools`의 [`groupby`](https://docs.python.org/ko/3/library/itertools.html?highlight=groupby#itertools.groupby)를 이용해 실행 결과를 **알고리즘 종류별로 묶어**줍니다.

```py
elapsed_times = groupby(benchmarks, extract_label_from_benchmark)
```

이제 반복문을 돌면서, 알고리즘 종류 별로 **배열 크기와 실행 시간을 종합**해 그래프에 그립니다.

Y축(실행 시간)이 너무 커질 경우를 대비해, [`math.log`](https://docs.python.org/ko/3/library/math.html?highlight=log#math.log)로 실행 시간에 $$ln$$을 취해줍니다.

```py
for key, group in elapsed_times:
    benchmark = list(group)
    x = list(map(extract_size_from_benchmark, benchmark))
    y = list(map(operator.itemgetter('real_time'), benchmark))
    log_y = list(map(math.log, y))
    plt.plot(x, log_y, label=key)
```

> `group`은 제너레이터(Generator)이기 때문에 **재사용이 불가능**합니다.
> 따라서 재사용이 필요한 경우, `list`로 **원소를 복사**해 사용해야 합니다.
>
> 참고: [파이썬 Generator(제네레이터)](https://wikidocs.net/16069)

마지막으로 그래프에 **축 제목과 범례**를 추가하고 **이미지 파일로 저장**합니다.

```py
plt.xlabel('array size')
plt.ylabel('ln(time)')
plt.title('Sorting Algorithm Benchmark')
plt.legend()
plt.savefig('benchmark.png')
plt.savefig('benchmark.svg')
```

![Benchmark](/assets/posts/2021-11-07-matplotlib-google-benchmark-visualization/benchmark.svg)

> `benchmark.svg`

최종 스크립트 파일입니다.

[`ArgumentParser`](https://docs.python.org/ko/3/library/argparse.html?highlight=argumentparser#argparse.ArgumentParser)를 이용해 **임의의 결과 파일에 대해 시각화**를 하는 기능도 추가했습니다.

```py
from argparse import ArgumentParser
from itertools import groupby
import json
import math
import operator
import matplotlib.pyplot as plt


def extract_label_from_benchmark(benchmark):
    benchmark_name = benchmark['name']
    return benchmark_name.split('/')[0][3:]  # erase `BM_`


def extract_size_from_benchmark(benchmark):
    benchmark_name = benchmark['name']
    return benchmark_name.split('/')[1]  # not int, for exp scale x axis


if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument('path', help='benchmark result json file')
    args = parser.parse_args()

    with open(args.path) as file:
        benchmark_result = json.load(file)
        benchmarks = benchmark_result['benchmarks']
        elapsed_times = groupby(benchmarks, extract_label_from_benchmark)
        for key, group in elapsed_times:
            benchmark = list(group)
            x = list(map(extract_size_from_benchmark, benchmark))
            y = list(map(operator.itemgetter('real_time'), benchmark))
            log_y = list(map(math.log, y))
            plt.plot(x, log_y, label=key)
        plt.xlabel('array size')
        plt.ylabel('ln(time)')
        plt.title('Sorting Algorithm Benchmark')
        plt.legend()
        plt.savefig('benchmark.png')
        plt.savefig('benchmark.svg')
```
