---
title: "Visual Studio에서 외부 라이브러리를 불러오는 방법"
date: 2023-01-04
author: Astro36
category: cpp
tags: [cpp, c, windows, visual_studio, dll, header, library]
---

**Visual Studio**에서는 기본적으로 **동적 링크**를 합니다.
따라서 Header-only 등 일부 라이브러리를 제외하면, DLL, Header, Library 모두를 설정해야 정상적으로 **외부 라이브러리**를 불러올 수 있습니다.

## DLL

`project > 속성 > 디버깅 > 환경`으로 이동해 아래와 같이 환경 변수를 지정합니다.

| Win32(x86) | x64 |
| --- | --- |
| ![image](https://user-images.githubusercontent.com/10459262/210139392-91b2af64-e998-49d0-9275-a2ac7a36d299.png) | ![image](https://user-images.githubusercontent.com/10459262/210139398-a20a3501-8389-444d-9db6-5f43c10ca098.png) |

`PATH=<dll이 들어 있는 폴더>;%PATH%`를 입력하면 됩니다.

지정한 **환경변수**는 `project.vcxproj.user` 파일에 저장됩니다.

GitHub에서 제공하는 Visual Studio `.gitignore` 프리셋에는 `*.vcxproj.user`가 **제외**되어 있으므로, 다른 사람에게 솔루션을 **공유**해야 할 때는 `project.vcxproj.user`가 저장소에 제대로 **업로드** 되었는지 **확인**해야 합니다.

## Header

`project > 속성 > C/C++ > 추가 포함 디렉터리`로 이동해 아래와 같이 경로를 **추가**합니다.

![image](https://user-images.githubusercontent.com/10459262/210365410-9ccfa6a9-4469-4c8d-b725-07c6dcfb5d90.png)

라이브러리의 **헤더 파일** 폴더 경로를 입력하면 됩니다.

여러 개인 경우 `;`을 이용해 각 경로를 구분합니다.

> `project > 속성 > VC++ 디렉터리 > 포함 디렉터리`을 이용해도 됩니다.
>
> `C/C++ > 추가 포함 디렉터리`는 [`/I` 옵션](https://learn.microsoft.com/ko-kr/cpp/build/reference/i-additional-include-directories?view=msvc-170)을 수정하며, `VC++ 디렉터리 > 포함 디렉터리`는 [INCLUDE 환경변수](https://learn.microsoft.com/ko-kr/cpp/build/reference/vcpp-directories-property-page?view=msvc-170)를 수정합니다.

## Library

`project > 속성 > 링커 > 추가 라이브러리 디렉터리`으로 이동해 아래와 같이 경로를 **추가**합니다.

| Win32(x86) | x64 |
| --- | --- |
| ![image](https://user-images.githubusercontent.com/10459262/210366575-ab0096f1-482a-402e-a1d9-dcd62576b69b.png) | ![image](https://user-images.githubusercontent.com/10459262/210366625-f2f38f0f-8aba-4175-81ab-ea5242545555.png) |

라이브러리의 **`.lib` 파일** 폴더 경로를 입력하면 됩니다.

**디버깅용 정보**가 포함된 `.lib` 파일인 경우, `freeglutd.lib`과 같이 관례적으로 파일 마지막에 `d`를 붙입니다.

> Header와 마찬가지로 `project > 속성 > VC++ 디렉터리 > 라이브러리 디렉터리`를 이용해도 정상적으로 작동합니다.
