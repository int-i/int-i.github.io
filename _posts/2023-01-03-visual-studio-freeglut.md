---
title: "Visual Studio에서 FreeGLUT 빌드하는 방법"
date: 2023-01-03
author: Astro36
category: c
tags: [c, cpp, windows, visual_studio, cmake, x86, x64, opengl, freeglut, computer_graphics]
---

[FreeGLUT](https://freeglut.sourceforge.net/)는 OpenGL Utility Toolkit(GLUT)의 **오픈소스** 버전으로, 간단한 **OpenGL 프로그래밍**에 편리하게 사용할 수 있는 라이브러리입니다.

공식적으로 FreeGLUT에서는 **컴파일된 패키지 형태**의 라이브러리는 배포하지 않고, **소스코드 형식**으로만 배포합니다.

**MSVC(Microsoft Visual C++) 사용자**가 **컴파일된 패키지 형태**의 라이브러리를 구하기 위해서는, [Martin Payne's Windows 바이너리](https://www.transmissionzero.co.uk/software/freeglut-devel/)를 이용하면 됩니다.

참고: [네가 선택한 컴퓨터 그래픽스... Visual Studio 프로젝트에 OpenGL 설치하기](https://int-i.github.io/c/2022-09-04/visualstudio-opengl/)

하지만, **Martin Payne 바이너리**는 [FreeGLUT v3.0.0(2015년 3월 배포)](https://github.com/FreeGLUTProject/freeglut/releases/tag/v3.0.0) 버전까지만 제공하기 때문에, 2022년 10월에 업데이트된 **FreeGLUT v3.4.0**에 비해 상당히 **오래된 버전**만 사용할 수 있습니다.

이 글에서는 Windows에서 **직접 FreeGLUT를 빌드**하는 방법을 알아볼 것입니다.

## 빌드

[FreeGLUT 소스코드](https://github.com/FreeGLUTProject/freeglut/releases)를 다운로드해서 압축을 풀어줍니다.

![visual-studio](/assets/posts/2023-01-03-visual-studio-freeglut/visual-studio.png)

Visual Studio **시작화면**에서 `로컬 폴더 열기`를 선택합니다.

**CMake 프로젝트**이기 때문에 `프로젝트 또는 솔루션 열기`를 선택하면 안됩니다.

![open-freeglut](/assets/posts/2023-01-03-visual-studio-freeglut/open-freeglut.png)

압축 푼 **FreeGLUT 소스코드**를 선택합니다.

![overview](/assets/posts/2023-01-03-visual-studio-freeglut/overview.png)

`CMake 설정 편집기 열기`를 선택합니다.

![add-buildtype](/assets/posts/2023-01-03-visual-studio-freeglut/add-buildtype.png)

좌측 상단의 `+`을 눌러 **빌드 타입을 추가**합니다.

![buildtype](/assets/posts/2023-01-03-visual-studio-freeglut/buildtype.png)

`x86-Debug`, `x86-Release`, `x64-Release`를 추가합니다.

![save-buildtype](/assets/posts/2023-01-03-visual-studio-freeglut/save-buildtype.png)

`Ctrl+S`로 **CMake 설정을 저장**합니다.

![select-buildtype](/assets/posts/2023-01-03-visual-studio-freeglut/select-buildtype.png)

상단의 **빌드 타입**을 `x64-Release`로 변경합니다.

![build](/assets/posts/2023-01-03-visual-studio-freeglut/build.png)

`Ctrl+Shift+B`로 **프로젝트를 빌드**합니다.

![build-out](/assets/posts/2023-01-03-visual-studio-freeglut/build-out.png)

**빌드 결과**는 `freeglut-3.4.0/out/build/x64-Release`에 저장됩니다.

`bin/freeglut.dll`, `lib/freeglut.lib`, `lib/freeglut_static.lib`가 **필요한 파일**이므로 따로 저장해둡니다.

`x64-Release`와 마찬가지로, `x86-Debug`, `x86-Release`, `x64-Debug`에 대해서도 빌드해줍니다.

Debug 타입의 경우, `freeglutd.dll`, `freeglutd.lib`, `freeglut_staticd.lib`와 같이 파일명 마지막에 `d`가 붙습니다.

최종적으로 **컴파일된 라이브러리를 배포**할 때는 `freeglut-3.4.0/include` 폴더(**헤더파일**)와 함께 배포합니다.

---

아래는 FreeGLUT v3.4.0 **컴파일한 결과**입니다.

Visual Studio에서 **컴파일된 FreeGLUT를 사용하는 방법**을 함께 첨부해두었습니다.

참고: [FreeGLUT Prebuilt](https://github.com/Astro36/freeglut-prebuilt)

참고: [Visual Studio에서 외부 라이브러리를 불러오는 방법](https://int-i.github.io/cpp/2023-01-04/visual-studio-lib/)
