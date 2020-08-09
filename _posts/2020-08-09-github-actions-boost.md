---
title: "GitHub Actions에서 CMake로 C++ 코드 빌드하기(Feat. Boost 라이브러리)"
date: 2020-08-09
author: Astro36
category: cpp
tags: [cpp, cmake, boost, build, github, actions]
---

[GitHub Actions](https://github.com/features/actions)는 GitHub에서 제공하는 작업 자동화 서비스로 **반복적인 작업을 자동화**할 수 있습니다.

이 글에서는 GitHub 저장소의 C++ 코드를 자동으로 빌드하는 예시를 보여줍니다.

## 작업 정의

```yml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
```

> `ubuntu-latest`는 `ubuntu-18.04`과 동일합니다.

참고: [Virtual environments for GitHub-hosted runners](https://docs.github.com/en/actions/reference/virtual-environments-for-github-hosted-runners)

## C++ 코드 가져오기

```yml
steps:
  - name: Checkout sources
    uses: actions/checkout@v2
```

> [Git Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)를 사용하고 있다면 `submodules: recursive` 옵션으로 코드를 가져올 수 있습니다.
>
> ```yml
> steps:
>   - name: Checkout sources
>     uses: actions/checkout@v2
>     with:
>       submodules: recursive
> ```
>
> 참고: [Checkout V2](https://github.com/actions/checkout)

## 선택: 의존성 다운로드

```yml
- name: Install dependencies
  run: |
      sudo apt-get update
      sudo apt-get install libjsoncpp-dev
```

위는 [JsonCpp](https://github.com/open-source-parsers/jsoncpp)를 다운로드하는 예제입니다.

> [Ubuntu 18.04.4 LTS](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu1804-README.md)를 참고해 GitHub에서 제공하는 운영체제에 프로그램이 이미 설치되었는지 먼저 확인해봅니다.
>
> [Boost](https://www.boost.org/) 라이브러리(`1.69.0|1.72.0`)의 경우 **이미 설치**되어 있기 때문에 다시 설치할 필요가 없습니다.

## C++ 코드 빌드

```yml
- name: Run CMake
  run: |
      cmake -S . -B build
      cmake --build build -j 2
```

> GitHub Actions는 **2-core CPU**를 제공하기 때문에 `-j 2`로 빌드 속도를 높일 수 있습니다.
>
> 참고: [How to build a project with CMake](https://cliutils.gitlab.io/modern-cmake/chapters/intro/running.html)

## 선택: Boost 라이브러리 포함해 빌드

GitHub Actions은 Boost 라이브러리 설치 위치를 각각 `$BOOST_ROOT_1_69_0`와 `$BOOST_ROOT_1_72_0` 변수로 제공합니다.

라이브러리 설치 위치가 수시로 변경되므로 `/opt/hostedtoolcache/boost/1.72.0/x64` 같이 경로를 하드코딩하지 말고 **변수로 사용**하길 권장하고 있습니다.

Boost 라이브러리를 include하기 위해서는 `CMakeLists.txt` 파일에서 아래와 같이 `include_directories`으로 **라이브러리 헤더 파일**을 가져옵니다.

```txt
# Boost headers only
find_package(Boost 1.66 REQUIRED)
include_directories(${Boost_INCLUDE_DIRS})
```

그리고 CMake에서 `-DBoost_INCLUDE_DIR` 옵션으로 **직접 헤더 파일 경로를 입력**해줘야 합니다.

헤더 파일은 `$BOOST_ROOT_1_72_0/include`에 있습니다.

```yml
- name: Run CMake
  run: |
      cmake -S . -B build -DBoost_INCLUDE_DIR=$BOOST_ROOT_1_72_0/include
      cmake --build build -j 2
```

참고: [How can I include Boost 1.72.0 on ubuntu-latest?](https://github.com/actions/virtual-environments/issues/1344)

## 전체 코드

```yml
name: C++

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout sources
        uses: actions/checkout@v2

      - name: Run CMake
        run: |
          cmake -S . -B build
          cmake --build build -j 2
```
