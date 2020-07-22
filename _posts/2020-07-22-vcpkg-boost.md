---
title: "Windows 10에서 Vcpkg를 이용해 Boost 라이브러리 설치하기"
date: 2020-07-22
author: Astro36
category: cpp
tags: [c, cpp, development_environment, vcpkg, boost]
---

[Vcpkg](https://github.com/Microsoft/vcpkg)는 Microsoft에서 만든 **C++ 패키지 관리자 프로그램**으로 복잡한 C++ 라이브러리 설치를 간소화하는 명령 줄 프로그램이다.

[Boost](https://www.boost.org/)는 C++ 기반의 라이브러리 집합으로 STL의 부족한 부분을 보완하는데 주로 사용된다.

## Vcpkg 설치

### 프로그램 요구사항

Vcpkg를 설치하기 위해서는 [Git](https://git-scm.com/downloads)과 [Microsoft C++ Build Tools 2015+ with the English language pack](https://visualstudio.microsoft.com/ko/visual-cpp-build-tools/)이 필요하다.

![Microsoft C++ Build Tools Install Screenshot](/assets/posts/2020-07-22-vcpkg-boost/ms_build_tools.png)

Visual Studio Install에서 위와 같이 옵션을 선택하고 빌드 도구를 설치한다.

### Vcpkg 코드 다운로드

C 드라이브 최상단(`C:\`)으로 이동해 아래 명령어로 Vcpkg 코드를 다운로드한다.

```txt
$ git clone https://github.com/microsoft/vcpkg
Cloning into 'vcpkg'...
remote: Enumerating objects: 84137, done.
remote: Total 84137 (delta 0), reused 0 (delta 0), pack-reused 84137
Receiving objects: 100% (84137/84137), 24.62 MiB | 7.14 MiB/s, done.
Resolving deltas: 100% (52141/52141), done.
Updating files: 100% (5070/5070), done.
```

### Vcpkg 코드 빌드

Vcpkg 코드가 담긴 폴더(`C:\vcpkg`)로 이동한다.

폴더 안의 `.\bootstrap-vcpkg.bat`을 실행한다.
이때 **`-disableMetrics` 옵션**을 주지 않으면 Vcpkg Telemetry가 같이 설치된다.

따라서 아래와 같이 명령어를 입력해 `.\bootstrap-vcpkg.bat`을 실행한다.

```txt
$ .\bootstrap-vcpkg.bat -disableMetrics
...
  visualstudio.cpp
  vcpkglib.vcxproj -> C:\vcpkg\toolsrc\msbuild.x86.release\vcpkglib.lib
  vcpkg.cpp
  코드를 생성하고 있습니다.
  Previous IPDB not found, fall back to full compilation.
  All 19105 functions were compiled because no usable IPDB/IOBJ from previous compilation was found.
  코드를 생성했습니다.
  vcpkg.vcxproj -> C:\vcpkg\toolsrc\msbuild.x86.release\vcpkg.exe

Building vcpkg.exe... done.
```

참고: [Vcpkg telemetry and privacy](https://github.com/microsoft/vcpkg/blob/master/docs/about/privacy.md)

## Boost 설치

`vcpkg install`을 이용해 **패키지를 설치**할 수 있다.

`:x64-windows`를 입력하지 않는다면 Windows 10에서는 기본값인 `:x86-windows`로 설치되게 된다.

```txt
$ .\vcpkg install boost:x64-windows
...
Building package boost[core]:x64-windows... done
Installing package boost[core]:x64-windows...
Installing package boost[core]:x64-windows... done
Elapsed time for package boost:x64-windows: 149.6 ms

Total elapsed time: 16.45 min
```

필자는 Boost 라이브러리 설치에 약 15분 정도 소요되었다.

인터넷 환경과 컴퓨터 성능에 따라 더 오랜 시간이 걸릴 수 있으니 참고바란다.

`vcpkg list`로 현재 **설치된 패키지 목록**을 볼 수 있다.

아래와 같이 Boost 라이브러리와 그 종속성(Dependency)들이 잘 설치된 것을 볼 수 있다.

```txt
.\vcpkg list
boost-accumulators:x64-windows                     1.73.0           Boost accumulators module
boost-algorithm:x64-windows                        1.73.0           Boost algorithm module
boost-align:x64-windows                            1.73.0           Boost align module
boost-any:x64-windows                              1.73.0           Boost any module
boost-array:x64-windows                            1.73.0           Boost array module
...
python3:x64-windows                                3.8.3#1          The Python programming language as an embeddable...
zlib:x64-windows                                   1.2.11#7         A compression library
zstd:x64-windows                                   1.4.4#2          Zstandard - Fast real-time compression algorithm
```

## CMake 설정

마지막으로 `vcpkg integrate install`로 [Visual Studio](https://visualstudio.microsoft.com/ko/)에서 `#include`를 통해 Vcpkg를 통해 설치한 라이브러리를 불러올 수 있게 한다.

```txt
$ .\vcpkg integrate install
Applied user-wide integration for this vcpkg root.

All MSBuild C++ projects can now #include any installed libraries.
Linking will be handled automatically.
Installing new libraries will make them instantly available.

CMake projects should use: "-DCMAKE_TOOLCHAIN_FILE=C:/vcpkg/scripts/buildsystems/vcpkg.cmake"
```

### CLion CMake 설정

만약 CLion을 사용하고 있다면 추가적인 단계가 필요하다.

![CLion CMake Config Screenshot](/assets/posts/2020-07-22-vcpkg-boost/clion_cmake.png)

`Configure > Settings > Build,Exception,Deployment > CMake`에서 CMake options에 `-DCMAKE_TOOLCHAIN_FILE=C:\vcpkg\scripts\buildsystems\vcpkg.cmake`을 입력해준다.

Vcpkg를 `C:\vcpkg`가 아닌 다른 곳에 설치했다면 `<Vcpkg 설치 경로>\scripts\buildsystems\vcpkg.cmake`를 입력해주도록 한다.

## Boost 테스트

Vcpkg로 Boost가 잘 설치되었는지 확인해보자.

아래 코드를 CLion으로 실행 시켜보자.

```cpp
#include <algorithm>
#include <boost/lambda/lambda.hpp>
#include <iostream>
#include <iterator>

int main() {
    using in = std::istream_iterator<int>;
    std::for_each(in(std::cin), in(), std::cout << (boost::lambda::_1 * 3) << '\n');
    return 0;
}
```

```txt
1
3
100
300
123456
370368
```

`boost::lambda::_1`는 첫 번째 인자를 나타내는 값이다.

즉, 위 코드는 입력한 수에 3을 곱한 수를 출력하는 코드이다.

코드가 정상적으로 실행되는 것으로 보아 Boost가 잘 설치되었음을 알 수 있다.
