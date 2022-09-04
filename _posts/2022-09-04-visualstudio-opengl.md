---
title: "네가 선택한 컴퓨터 그래픽스... Visual Studio 프로젝트에 OpenGL 설치하기"
date: 2022-09-05
author: Astro36
category: c
tags: [c, visual_studio, opengl, freeglut, computer_graphics, nuget]
thumbnail: /assets/posts/2022-09-04-visualstudio-opengl/thumbnail.jpg
---

인하대학교 컴퓨터그래픽스설계(ICE3016) 강좌에는 **C언어**로 **OpenGL 프로그래밍**을 하는 실습이 포함되어 있습니다.

**Visual Studio**에서 C언어로 OpenGL 프로그래밍을 하려면 **GLUT(OpenGL Utility Toolkit)를 다운**받아야 합니다.

GLUT는 운영체제에서 OpenGL 응용프로그램과 **인터페이스**를 위한 창 관리를 제공하는 ***유틸리티 툴킷***을 말합니다.

**창의 크기와 형태**를 정의하고 제어하며, 키보드와 마우스 등 기본 입력장치를 비롯해 시스템 수준의 **입출력**을 가능하게 합니다.

마이크로소프트 윈도우와 일부 운영체제는 **미리 컴파일**된 GLUT 바이너리를 받아 적용할 수 있으며, 그 외의 지원되지 않는 플랫폼은 소스코드를 내려받아 **직접 컴파일**해야 합니다.

## FreeGLUT 바이너리 설치

이 방법은 Windows에서 **미리 컴파일**된 **GLUT 바이너리**를 다운받아 설치하는 방법입니다.

> 해당 방법은 인하대학교 컴퓨터그래픽스설계(ICE3016) 강의노트를 참고했습니다.

[freeglut.sourceforge.net](http://freeglut.sourceforge.net/)에 들어갑니다.

![sourceforge](/assets/posts/2022-09-04-visualstudio-opengl/sourceforge.png)

[Martin Payne의 Windows 바이너리](https://www.transmissionzero.co.uk/software/freeglut-devel/)를 찾아 들어갑니다.

![transmissionzero](/assets/posts/2022-09-04-visualstudio-opengl/transmissionzero.png)

**Visual Studio**를 이용해 OpenGL 프로그래밍을 할 것이기 때문에 **MSVC 패키지**를 다운로드 받고 압축을 풀어줍니다.

![unzip](/assets/posts/2022-09-04-visualstudio-opengl/unzip.png)

Visual Studio를 켜고 **새 프로젝트**를 만듭니다.

![newproject](/assets/posts/2022-09-04-visualstudio-opengl/newproject.png)

"Windows 데스크롭 마법사"를 선택하고 "빈 프로젝트"로 프로젝트를 **생성**하면 됩니다.

![newsolution](/assets/posts/2022-09-04-visualstudio-opengl/newsolution.png)

"소스파일" 폴더에 `main.c` 이름으로 **새 파일**을 만듭니다.

![newfile](/assets/posts/2022-09-04-visualstudio-opengl/newfile.png)

C 파일이 만들어지면 상단 툴바에서 **빌드 타입과 플랫폼**을 **Release x64**로 변경합니다.

![release_x64](/assets/posts/2022-09-04-visualstudio-opengl/release_x64.png)

**프로젝트 속성**으로 갑니다.

![property](/assets/posts/2022-09-04-visualstudio-opengl/property.png)

"C/C++/일반" 탭으로 이동해 "추가 포함 디렉터리"에 `include;`를 입력합니다.

![c_cpp_general](/assets/posts/2022-09-04-visualstudio-opengl/c_cpp_general.png)

> 속성 상단의 구성과 플랫폼이 **Release, x64**로 변경되었는지 확인해야 합니다.

"링커/일반" 탭에서 "추가 라이브러리 디렉터리"에 `lib\x64`를 입력합니다.

![linker_general](/assets/posts/2022-09-04-visualstudio-opengl/linker_general.png)

> `\`는 슬래쉬(`/`)가 아니라 **역슬래쉬**(엔터 위에 있는 키)입니다.

"링커/입력" 탭에서 "추가 종속성" 맨 앞에 `freeglut.lib;`를 입력합니다.

![linker_input](/assets/posts/2022-09-04-visualstudio-opengl/linker_input.png)

이제 압축을 풀어뒀던 FreeGlut 폴더를 프로젝트로 **이동**시킵니다.

그리고, `bin/freeglu.dll`를 **복사**해서 프로젝트 루트로 **붙여넣기** 합니다.

아래는 라이브러리 파일 이동이 끝났을 때 **프로젝트 폴더**의 상태입니다.

![project_dir](/assets/posts/2022-09-04-visualstudio-opengl/project_dir.png)

여기까지 잘 따라왔다면 아래 코드를 실행했을 때 화면에 **주전자**가 보일 겁니다.

`main.c`:

```c
#include <GL/glut.h>

void draw(void) {
    glColor3f(1.0, 1.0, 1.0);
    glutWireTeapot(0.5);
    glFlush();
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowSize(500, 500);
    glutInitWindowPosition(300, 300);
    glutCreateWindow("12000000 인트아이");
    glutDisplayFunc(draw);
    glutMainLoop();
    return 0;
}
```

![teapot](/assets/posts/2022-09-04-visualstudio-opengl/teapot.png)

## NuGet 이용

직접 FreeGLUT 바이너리 설치를 방법은 상당히 복잡하고 실수할 여지도 많기 때문에 **NuGet를 이용**한 방법을 **추천**합니다.

상단 "도구" 탭에서 "솔루션용 NuGet 패키지 관리"를 클릭합니다.

![tool](/assets/posts/2022-09-04-visualstudio-opengl/tool.png)

"freeglut"를 **검색**해서 가장 **최신**의 "freeglut.3.2.2.v140"를 **설치**합니다.

![nuget](/assets/posts/2022-09-04-visualstudio-opengl/nuget.png)

프로젝트를 **체크**하고 "설치"를 누르면 끝납니다.

마찬가지로 아래 코드를 **실행**하면 화면에 주전자가 보일 것입니다.

`main.c`:

```c
#include <GL/glut.h>

void draw(void) {
    glColor3f(1.0, 1.0, 1.0);
    glutWireTeapot(0.5);
    glFlush();
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowSize(500, 500);
    glutInitWindowPosition(300, 300);
    glutCreateWindow("12000000 인트아이");
    glutDisplayFunc(draw);
    glutMainLoop();
    return 0;
}
```

![teapot](/assets/posts/2022-09-04-visualstudio-opengl/teapot.png)
