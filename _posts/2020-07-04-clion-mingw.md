---
title: "CLion과 Mingw-w64를 이용한 C++ 개발환경 세팅"
date: 2020-07-04
author: Astro36
category: cpp
tags: [c, cpp, ide, development_environment, clion, mingw, mingw_w64, gcc]
---

Windows에서 C++ 통합 개발환경으로는 크게 Visual Studio와 CLion이 있다.

[Visual Studio](https://visualstudio.microsoft.com/ko/vs/features/cplusplus/)는 C++을 컴파일하기 위한 MSVC(Microsoft Visual C++)까지 같이 설치하기 때문에 별도의 세팅이 필요가 없지만 [scanf](https://siriusp.tistory.com/352), [fflush](https://int-i.github.io/c/2020-04-26/fflush-stdin/), [min max](https://bspfp.pe.kr/archives/591), [등](https://penglog.tistory.com/12)의 문제로 인해 C++을 깊게 배우거나 사용할 때는 자제하는 분위기이다.

따라서 GCC를 사용하는 것이 나은데, GCC는 리눅스용 프로그램이기 때문에 Windows에서는 GCC를 Windows용으로 포팅한 MinGW/Mingw-w64를 사용한다.

컴파일러 문제 이외에도, CLion은 Visual Studio에 비해 C++ 프로젝트를 크로스컴파일하기 위해 필요한 CMakeLists.txt 파일 사용이 편리하다.

## CLion

CLion은 기본적으로 유료 프로그램(30일 무료 체험판 제공)이나 학생인증을 통해 무료로 사용할 수 있다.

CLion은 [이곳](https://www.jetbrains.com/ko-kr/clion/)에서 다운로드 할 수 있다.

![CLion Install Options Screenshot](/assets/posts/2020-07-2020-07-04-clion-mingw/clion_install_option.png)

프로그램을 설치하다 보면 위와 같이 추가적으로 옵션을 설치할지 물어보는데 사용하지 않을거라면 Disable을 눌러주면 된다.

## Toolchain

CLion은 Visual Studio와 다르게 컴파일러를 설치해주지 않는다.
따라서 본인 직접 컴파일러를 설치해야 한다.

![Mingw-w64 Install Page Screenshot](/assets/posts/2020-07-04-clion-mingw/mingw_install.png)

이 글에서는 컴파일러로 Mingw-w64를 사용하기 때문에 [이곳](http://mingw-w64.org/doku.php/download/mingw-builds)에서 컴파일러를 직접 다운받는다.

> Mingw-w64는 MinGW의 수정(개선) 버전으로 64비트와 새로운 API를 지원한다.

### Mingw-w64 설치 옵션

(7월 4일 당시 최신버전 기준)

- Version: 8.1.0
- Architecture: x86_64
- Threads: posix
- Exception: seh
- Build revision: 0

### Toolchain 설정

Mingw-w64 설치가 끝났다면 CLion을 실행시켜 `Configure > Settings > Build,Exception,Deployment > Toolchains`으로 가 `+`을 눌러 `MinGW`을 선택해 추가한다.

Environment에 Mingw-w64를 설치한 경로를 입력해준다.
기본 경로는 `C:\Program Files\mingw-w64\x86_64-8.1.0-posix-seh-rt_v6-rev0\mingw64`이다.

![CLion Toolchain Screenshot](/assets/posts/2020-07-04-clion-mingw/clion_toolchain.png)

성공적으로 툴체인을 인식했다면, 위와 같이 초록색 체크표시와 Compiler가 Detected 되었다고 뜬다.

이제 C++ 프로그램을 컴파일할 환경 설정이 끝났다.

## (선택) Code Formatter

여기부터는 선택사항이지만, C++ 개발에 도움이 되는 세팅을 소개한다.

Code Formatter는 코드를 보기 쉽도록 자동으로 정렬하는 프로그램/기능으로 CLion을 설치하면 [Clang-Format](https://clang.llvm.org/docs/ClangFormat.html)이 같이 설치된다.

![CLion Clang-Format Enable Screenshot](/assets/posts/2020-07-04-clion-mingw/clion_format_enable.png)

IDE의 오른쪽 아래 4spaces를 클릭하면 Clang-Format을 활성화할 수 있는 옵션이 존재한다.

CLion에서 기본적으로 제공하는 코드 정렬 규칙이 있지만, 난 맘에 안들어서 직접 만든 정렬 규칙을 사용한다.

> 내가 사용하는 규칙은 [Rust-like Clang-Format Style](https://gist.github.com/Astro36/ef933be73050b4d5a6e0522536723a18)에서 다운받을 수 있다.

규칙을 수정하려면 프로젝트 폴더의 `.clang-format` 파일을 수정해서 저장하면 된다.
만약 `.clang-format` 파일이 안보인다면, 그냥 `.clang-format`을 새로 만들어 저장하면 된다.

> 직접 코드 정렬 규칙을 설정하고 싶다면 [Clang-Format Style Options](https://clang.llvm.org/docs/ClangFormatStyleOptions.html)를 참고하자.

## (선택) Code Analysis

Code Analysis는 코드에서 메모리 누수, 불필요한 로직, 버그 발생 가능성이 있는 코드 등을 자동으로 찾아서 프로그래머에게 알려주는 기능이다.

CLion을 설치하면 자동으로 [Clang-Tidy](https://clang.llvm.org/extra/clang-tidy/)가 설치된다.

Clang-Tidy는 별도의 세팅이 없이 사용하면 된다.
잠재적으로 문제가 있는 코드를 오른쪽 스크롤바에 노란색 네모로 표시된다.

### Cppcheck

Cppcheck 역시 Clang-Tidy와 같은 Code Analysis 도구이다.

Clang-Tidy에 비해 메모리 누수/침범 가능한 지점을 빡세게 잡아주므로, Clang-Tidy와 함께 사용하는 것을 추천한다. (상호보완적인 성격)

![Cppcheck Install Page Screenshot](/assets/posts/2020-07-04-clion-mingw/cppcheck_install.png)

[이곳](http://cppcheck.sourceforge.net/)에서 Cppcheck을 다운로드하고 설치한다.

![CLion Cppcheck Plugin Install Screenshot](/assets/posts/2020-07-04-clion-mingw/clion_cppcheck_install.png)

Cppcheck 설치가 완료되면, CLion에서 Cppcheck 플러그인을 설치한다.

![CLion Cppcheck Plugin Screenshot](/assets/posts/2020-07-04-clion-mingw/clion_cppcheck.png)

마지막으로 위와 같이 Cppcheck Path에 Cppcheck을 설치한 경로를 입력해준다.
기본 경로는 `C:\Program Files\Cppcheck\cppcheck.exe`이다.

Cppcheck가 잘 작동하는지 확인하려면 아래와 같이 고의적으로 메모리 누수가 발생하는 코드를 작성하면 된다.

![CLion Cppcheck Plugin Warn Screenshot](/assets/posts/2020-07-04-clion-mingw/clion_cppcheck_warn.png)

활성화가 되었다면 밑줄로 경고 지점이 표시된다.
