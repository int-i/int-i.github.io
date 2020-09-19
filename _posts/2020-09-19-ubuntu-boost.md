---
title: "Ubuntu 20.04에서 직접 Boost 라이브러리 설치하기"
date: 2020-09-19
author: Astro36
category: cpp
tags: [c, cpp, development_environment, linux, ubuntu, boost]
---

[Boost Downloads](https://www.boost.org/users/download/)로 가서 라이브러리를 다운로드합니다.

```txt
$ wget https://dl.bintray.com/boostorg/release/1.74.0/source/boost_1_74_0.tar.gz
```

`wget`을 이용하면 리눅스에서 파일을 다운로드 할 수 있습니다.

```txt
$ tar -xvf boost_1_74_0.tar.gz
$ cd boost_1_74_0
```

다운로드한 파일의 압축을 풀고 폴더로 이동합니다.

- `x` : 묶음을 해제
- `v` : 압축 해제 과정을 화면에 표시
- `f` : 파일 이름을 지정

참고: [리눅스 tar.gz 압축 및 해제](https://realforce111.tistory.com/entry/%EB%A6%AC%EB%88%85%EC%8A%A4-targz-%EC%95%95%EC%B6%95-%EB%B0%8F-%ED%95%B4%EC%A0%9C)

```txt
$ ./bootstrap.sh
Building Boost.Build engine with toolset gcc... tools/build/src/engine/b2
Unicode/ICU support for Boost.Regex?... not found.
Backing up existing Boost.Build configuration in project-config.jam.1
Generating Boost.Build configuration in project-config.jam for gcc...

Bootstrapping is done. To build, run:

    ./b2

To generate header files, run:

    ./b2 headers

To adjust configuration, edit 'project-config.jam'.
Further information:

   - Command line help:
     ./b2 --help

   - Getting started guide:
     http://www.boost.org/more/getting_started/unix-variants.html

   - Boost.Build documentation:
     http://www.boost.org/build/
```

빌드를 위한 설정 파일을 만들어주는 과정입니다.

```txt
$ sudo ./b2 install
Performing configuration checks

    - default address-model    : 64-bit
    - default architecture     : x86
    - C++11 mutex              : yes
    - lockfree boost::atomic_flag : yes
    - has stat::st_mtim        : yes
    - has stat::st_mtimensec   : no
    - has stat::st_mtimespec   : no
    - Boost.Config Feature Check: cxx11_auto_declarations : yes
    - Boost.Config Feature Check: cxx11_constexpr : yes
    - Boost.Config Feature Check: cxx11_defaulted_functions : yes
    - Boost.Config Feature Check: cxx11_final : yes
    - Boost.Config Feature Check: cxx11_hdr_mutex : yes
    - Boost.Config Feature Check: cxx11_hdr_tuple : yes
    - Boost.Config Feature Check: cxx11_lambdas : yes
    - Boost.Config Feature Check: cxx11_noexcept : yes
    - Boost.Config Feature Check: cxx11_nullptr : yes
    - Boost.Config Feature Check: cxx11_rvalue_references : yes
    - Boost.Config Feature Check: cxx11_template_aliases : yes
    - Boost.Config Feature Check: cxx11_thread_local : yes
    - Boost.Config Feature Check: cxx11_variadic_templates : yes
    - has_icu builds           : no
...
common.copy /usr/local/lib/cmake/boost_date_time-1.74.0/boost_date_time-config.cmake
common.copy /usr/local/include/boost/compatibility/cpp_c_headers/cctype
common.copy /usr/local/include/boost/compatibility/cpp_c_headers/cassert
common.copy /usr/local/lib/cmake/boost_coroutine-1.74.0/libboost_coroutine-variant-shared.cmake
common.copy /usr/local/lib/cmake/boost_thread-1.74.0/boost_thread-config.cmake
common.copy /usr/local/lib/cmake/boost_date_time-1.74.0/boost_date_time-config-version.cmake
common.copy /usr/local/lib/cmake/boost_date_time-1.74.0/libboost_date_time-variant-shared.cmake
common.copy /usr/local/lib/libboost_exception.a
ln-UNIX /usr/local/lib/libboost_date_time.so
common.copy /usr/local/lib/cmake/boost_exception-1.74.0/boost_exception-config.cmake
common.copy /usr/local/lib/cmake/boost_exception-1.74.0/boost_exception-config-version.cmake
...updated 15823 targets...
```

라이브러리를 실질적으로 설치하는 과정입니다.
`/usr/local/lib`에 Boost를 설치할 때는 `sudo`로 실행해야 파일이 정상적으로 생성됩니다.

참고: [Boost Getting Started on Unix Variants](https://www.boost.org/doc/libs/1_74_0/more/getting_started/unix-variants.html)

```txt
find_package(Boost 1.69 REQUIRED COMPONENTS regex)
include_directories(${Boost_INCLUDE_DIRS})
target_link_libraries(${PROJECT_NAME} ${Boost_LIBRARIES})
```

CMake에서는 위와 같이 설치된 Boost 라이브러리를 불러올 수 있습니다.
일부 `locale`, `regex`와 같이 Boost 라이브러리는 `find_package`의 `COMPONENTS`에 불러올 대상을 직접 명시해야 합니다.

참고: [CMake FindBoost](https://cmake.org/cmake/help/latest/module/FindBoost.html)
