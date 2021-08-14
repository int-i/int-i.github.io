---
title: "CodeCov 100%? 그만큼 확실하시다는 거지: Codecov를 이용한 C++ 코드 커버리지 측정 방법"
date: 2021-08-14
author: Astro36
category: cpp
tags: [c, cpp, gcc, cmake, meson, testing, code_coverage, gcov, gcovr, codecov]
thumbnail: /assets/posts/2021-08-14-cpp-codecov/thumbnail.jpg
---

> 코드 커버리지(Code Coverage): 소프트웨어 테스트에서 얼마나 테스트가 충분한가를 나타내는 지표

코드 커버리지는 Coverage라는 단어의 뜻 그대로, **테스트에 의해 실행되는 코드의 비율**입니다.

코드 커버리지가 100%라면 **전체 코드가 테스트**되었음을 의미합니다.

즉, 그만큼 코드가 확실하게 동작한다는 것을 보장할 수 있기에, 좋은 테스트 작성의 길라잡이가 될 수 있습니다.

참고: [코드 커버리지(Code Coverage)가 뭔가요?](https://woowacourse.github.io/tecoble/post/2020-10-24-code-coverage/)

코드 커버리지에 대한 간단한 설명은 여기까지로 하고, **C++ 프로젝트**의 코드 커버리지 측정과 [Codecov](https://about.codecov.io/) 연동 방법을 소개해보도록 하겠습니다.

## 테스트 작성

코드 커버리지 측정을 위해서는, 코드를 테스트하는 코드가 필요합니다.

이 글에서는 [예시 프로젝트](https://github.com/int-i/cpp-sort)를 통해 코드 커버리지 측정을 알아볼 것입니다.

예시 프로젝트의 `tests/test_sort.cpp`는 `sort` 함수를 테스트하는 코드로, [RapidCheck](https://github.com/emil-e/rapidcheck)를 이용해 테스트를 작성했습니다.

참고: [인하대학교 인트아이 - ???: 내 이름은 PBT. 어설픈 건 용납 못해 (Feat. RapidCheck)](https://int-i.github.io/cpp/2021-07-25/cpp-pbt-rapidcheck/)

## 코드 컴파일

코드 커버리지 측정을 위한 컴파일은, 평소의 방식에 **약간의 플래그(Flag)를 추가**해야 합니다.

GCC를 사용하고 있다면 `--coverage` 플래그를 추가해서 컴파일합니다:

```txt
g++ --coverage example.cpp -o example
```

> `--coverage`는 `-fprofile-arcs -ftest-coverage`과 동일합니다.
>
> 참고: [Instrumentation Options (Using the GNU Compiler Collection (GCC))](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

> `-O0`는 GCC 컴파일러의 기본값입니다.
>
> 참고: [Optimize Options (Using the GNU Compiler Collection (GCC))](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

---

[CMake](https://cmake.org/)에서는 아래와 같이 플래그를 추가합니다.

`CMakeLists.txt`:

```txt
option(ENABLE_COVERAGE "Enable coverage" OFF)

if(ENABLE_COVERAGE)
    add_compile_options(--coverage)
    add_link_options(--coverage)
endif()
```

> 주의: `add_link_options`는 CMake 3.13이상에서 동작합니다.
>
> 참고: [CMake - `add_link_options`](https://cmake.org/cmake/help/latest/command/add_link_options.html)

```txt
$ cmake -S . -B build -DENABLE_COVERAGE=ON
$ cmake --build build
```

참고: [Gcovr - CMake](https://gcovr.com/en/stable/cookbook.html#oos-cmake)

---

[Meson](https://mesonbuild.com/)에서는 아래와 같이 플래그를 추가합니다.

```txt
$ meson setup build -Db_coverage=true
```

참고: [Meson - Unit Tests](https://mesonbuild.com/Unit-tests.html#coverage)

Meson의 설치 방법을 알고 싶다면, [CMake는 가라! Meson과 함께하는 차세대 C++ 빌드 시스템 구축](https://int-i.github.io/cpp/2021-06-26/cpp-meson/)를 참고해주세요.

## 테스트 실행

코드가 `--coverage` 플래그로 컴파일되었다면, **컴파일된 코드를 실행**합니다.

일반적인 방법:

```txt
$ ./example
```

Meson의 테스트 실행 방법:

```txt
$ meson test -C build
```

## 코드 커버리지 보고서 생성

코드 실행이 완료되면 `.gcda`와 `.gcno` 파일이 생성됩니다.

위 파일을 [Gcov](https://gcc.gnu.org/onlinedocs/gcc/Gcov.html)를 통해 분석하면 코드 커버리지 보고서를 얻을 수 있습니다.

[Gcovr](https://www.gcovr.com/)는 **Gcov를 쉽게 사용**할 수 있게 만든 도구입니다.

Gcovr 설치:

```txt
$ pip install gcovr
```

설치한 Gcovr를 이용해 커버리지 보고서를 생성합니다.

일반적인 방법:

```txt
$ gcovr -r .
```

참고: [Gcovr User Guide](https://gcovr.com/en/stable/guide.html)

Meson의 보고서 생성 방법:

```txt
$ ninja -C build coverage
```

> 주의: Gcovr 3.3 이상이 설치되어 있어야 합니다.

## Codecov 연동

Codecov는 웹사이트에서 **코드 커버리지를 시각화**해서 보여주는 도구입니다.

Codecov를 이용하기 위해서는 위에서 생성한 **코드 커버리지 보고서를 업로드**해야 하는데, [GitHub Actions](https://github.com/features/actions)를 이용하면 이것을 자동화할 수 있습니다.

```yml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v2
  with:
    file: ./coverage.xml # 코드 커버리지 파일
    fail_ci_if_error: true
```

참고: [Codecov GitHub Action](https://github.com/codecov/codecov-action)

## 발생가능한 문제와 해결 방법

### Q1. 코드 커버리지가 0%로 나와요

A1. 테스트 코드를 먼저 실행한 이후에, Gcovr를 실행해주세요.

### Q2. Codecov에서 노란색 줄이 의미하는 게 뭔가요?

참고: [Codecov - Viewing Source Code](https://docs.codecov.com/docs/viewing-source-code)

### Q3. `-O0`로 코드 커버리지를 측정하면 결과가 너무 낮게 나와요.

참고: [Low branch coverage especially when using 3rd party libs. ex boost](https://stackoverflow.com/questions/44655285/low-branch-coverage-especially-when-using-3rd-party-libs-ex-boost)

참고: [Why does C++ code have so many uncovered branches?](https://gcovr.com/en/stable/faq.html#why-does-c-code-have-so-many-uncovered-branches)

Gcovr의 `--exclude-unreachable-branches`와 `--exclude-throw-branches`를 이용해주세요.

Gcovr에 **직접 플래그를 전달**할 수도 있고 `gcovr.cfg` **파일을 이용해 전달**할 수도 있습니다.
