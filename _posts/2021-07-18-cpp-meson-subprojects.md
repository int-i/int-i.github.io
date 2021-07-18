---
title: "서브모듈 멈춰! 얘들아 Meson 받아라~ 서브프로젝트 두둥등장~"
date: 2021-07-18
author: Astro36
category: cpp
tags: [c, cpp, cmake, meson, subprojects, gcc, git, submodule, subtree]
---

[지난 글](https://int-i.github.io/cpp/2021-06-26/cpp-meson/)에서 Meson에 대한 소개와 함께 사용 방법을 알아봤습니다.

이번에는 Meson의 심화 과정으로 **서브프로젝트(Subproject) 기능**을 이용해 **외부 라이브러리를 가져오는 방법**을 알려드리겠습니다.

우선 Meson의 서브 프로젝트 기능을 소개하기 전에 기존에 방식을 알아보겠습니다.

오늘날 대다수의 C++ 프로젝트는 **CMake를 이용**해 코드를 관리하는데, CMake에서는 주로 [`add_subdirectory`](https://cmake.org/cmake/help/latest/command/add_subdirectory.html)로 [Git Submodule](https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-%EC%84%9C%EB%B8%8C%EB%AA%A8%EB%93%88)을 통해 가져온 라이브러리를 불러옵니다.

이 방식이 나쁜 방법은 아니지만, CMake 특유의 **난해한 문법**과 Git 저장소에 서브모듈을 **별도로 관리**해줘야 한다는 단점이 있습니다.

> 사실 CMake에도 [`FetchContent`](https://cmake.org/cmake/help/latest/module/FetchContent.html)라는 기능이 있지만, Meson이 더 **사용하기 편하고 기능이 많기** 때문에 자세한 설명은 생략하도록 하겠습니다.
>
> 참고: [C++ 프로젝트를 위한 CMake 사용법](https://modoocode.com/332)

Meson은 CMake 보다 **문법이 간결**할 뿐더러 CMake 못지 않은 **여러 기능을 지원**하기 때문에 새로운 프로젝트를 시작하실 예정이라면 한 번 찍어먹어 보시기엔 충분합니다.

서브프로젝트를 통해 가져올 수 있는 C++ 라이브러리의 상태는 크게 3가지로 나눌 수 있습니다.

1. 가져올 라이브러리가 Meson Wrap DB에 업로드 되어 있는 경우
2. 가져올 라이브러리가 Meson 빌드 파일(`meson.build`)을 포함하고 있는 경우
3. 가져올 라이브러리가 Meson 이외 빌드 시스템의 빌드 파일(`CMakeLists.txt` 등)을 포함하고 있는 경우

---

첫 번째 상태의 경우가 가장 사용하기 쉬운 상태입니다.

Meson은 Wrap이라는 **패키지 시스템**을 가지고 있는데, 이를 이용하면 쉽게 라이브러리를 설치하고 이용할 수 있습니다.

[GoogleTest](https://github.com/google/googletest) 설치 예시:

```txt
$ mkdir subprojects
$ meson wrap install gtest
Installed gtest branch 1.10.0 revision 1
```

`meson.build`:

```txt
gtest_proj = subproject('gtest')
gtest_dep = doctest_proj.get_variable('gtest_dep')
```

> Meson의 서브프로젝트는 `subprojects` 디렉토리를 이용합니다.

다만, 한 가지 단점은 아직 Wrap에 많은 **패키지가 등록되어 있지 않다**는 것입니다.

따라서 직접 Git을 통해 라이브러리를 가져오는 방법 또한 필요합니다.

참고: [Meson - WrapDB packages](https://mesonbuild.com/Wrapdb-projects.html)

---

2번의 경우는 가져올 라이브러리에 `meson.build` 파일이 존재하는 경우로, 이 또한 간단하게 라이브러리를 가져올 수 있습니다.

[doctest](https://github.com/onqtam/doctest) 설치 예시:

```txt
$ mkdir subprojects
$ vi subprojects/doctest.wrap

[wrap-git]
url = https://github.com/onqtam/doctest
revision = 2.4.6
```

`meson.build`:

```txt
doctest_proj = subproject('doctest')
doctest_dep = doctest_proj.get_variable('doctest_dep')
```

참고: [Meson - Wrap dependency system manual](https://mesonbuild.com/Wrap-dependency-system-manual.html)

만약 라이브러가 Git을 이용하고 있지 않다면, `[wrap-file]`을 이용하면 됩니다.

1번과의 차이점은 **직접 `.wrap` 파일을 작성**해야 한다는 것입니다.

---

마지막으로 가져올 라이브러리에 `meson.build` 파일이 없는 경우입니다.

이때는 **CMake를 경유**해 라이브러리를 가져와야 하기 때문에 조금 복잡해질 수 있습니다.

또한, 당연하게도 **CMake가 설치**되어 있어야 `import('cmake')`가 정상적으로 작동합니다.

[RapidCheck](https://github.com/emil-e/rapidcheck) 설치 예시:

```txt
$ mkdir subprojects
$ vi subprojects/rapidcheck.wrap

[wrap-git]
url = https://github.com/emil-e/rapidcheck.git
revision = head
```

`meson.build`:

```txt
cmake = import('cmake')

rapidcheck_proj = cmake.subproject('rapidcheck')
rapidcheck_dep = rapidcheck_proj.dependency('rapidcheck')
```

`project.dependency(name)`를 통해 불러오는 부분에는 CMake의 [`add_library`](https://cmake.org/cmake/help/latest/command/add_library.html) 코드의 `name`을 작성하면 됩니다.

참고: [Meson - CMake Module](https://mesonbuild.com/CMake-module.html)

---

참고: [Meson - Subprojects](https://mesonbuild.com/Subprojects.html)


