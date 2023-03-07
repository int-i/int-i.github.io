---
title: "그래픽스는 수학을 좋아한다: ICE3016 컴퓨터그래픽스설계 수강 후기"
date: 2023-03-07
author: Astro36
category: retrospective
tags: [retrospective, c, cpp, opengl, freeglut, computer_graphics]
thumbnail: /assets/posts/2023-03-07-computer-graphics-review/thumbnail.jpg
---

> 그래픽스는 수학을 좋아한다.

그래픽스는 수학을 좋아한다.

그들은 새로운 그림을 그릴 때 대상의 본질적인 것에 대해 물어보는 법이 없다.

만일 컴퓨터에게 "작고 하얀 주전자를 봤어요. 내부는 투명했고 표면에 은은한 조명이 반사돼서 맑고 깨끗한 느낌이 들었어요"라고 말하면 그들은 그 물건이 어떤 그림인지를 생각해 내지 못한다.

그들에게는 "Clockwise로 정의된 Utah Teapot을 봤어요. BRDF Shader와 Back-face Culling이 적용됐어요"라고 말해야 한다.

그러면 그들은 "야, 참으로 정교하게 설계된 주전자구나!"라고 소리를 지른다.

'어린그래픽스' 중

---

인하대학교의 ICE3016 **컴퓨터그래픽스설계**는 정보통신공학과의 주요 **설계과목** 중 하나로,

컴퓨터그래픽스의 기초가 되는 **행렬** 공식을 배우고, **OpenGL**을 통해 **그래픽스 실습**을 하는 과목입니다.

**선형대수 DLC**라고 부를 정도로 행렬 변환에 대해 깊게 배우며 거기에서 파생된 사원수(Quaternion)까지 다루기에,

본인이 **수포자**라면 코딩 과목이란 가면에 낚이지 말고 **드랍**하시길 적극 권장 드립니다.

## 강의 내용

3차원 공간상의 점을 카메라가 볼 때, 점이 모니터 상에서 어디에 위치하는지를 **행렬 변환**을 통해 계산하는 방법을 배웁니다.

그밖에도 물체의 출동을 탐지하는 **AABB**, **OBB** 등의 알고리즘과 **베지어 곡선**, **브레젠험**(Bresenham) 알고리즘, **Blender 모델링**, **텍스처**, **GPU 구조**, **CUDA 프로그래밍**까지 그래픽스와 관련된 전반적인 내용을 학습할 수 있습니다.

배우는 양이 많기에 많은 시간 투자가 필요한 과목이며 마지막 과제로 **OpenGL을 이용한 미니프로젝트**가 나가기에, 열심히 따라온다면 많은 것을 남길 수 있는 강의입니다.

### 이런 사람들에게 추천해요

- 선형대수가 재밌어요
- VR/AR/게임/메타버스에 관심있어요
- GPU에 대해 공부하고 싶어요
- 프로젝트 포트폴리오가 필요해요

### 이런 사람들에게 추천하지 않아요

- 수학이 너무 싫어요
- 코딩이 싫어요
- 공부할 시간이 없어요
- 적당히 공부하고 학점 따고 싶어요

## 미니 프로젝트

컴퓨터그래픽스'설계'에 꽃입니다.

학점에서 차지하는 비중도 높으며, 지금까지 실습한 내용을 **종합**적으로 평가받는 과정이기에 매우 중요합니다.

2022년 2학기에는 **OpenGL을 이용한 3차원 제품 카탈로그 구현**이 주제로 나왔습니다.

### 상위 30% 프로젝트 카탈로그 물체 목록

- 오픈형 에어프라이기
- 볼펜
- 자전거
- 케이블카
- 세탁기
- 기계식 연필깎이
- 오르골
- 청소기
- 턴테이블

> 교수님께서 **상위 30% 프로젝트**는 학점을 +로 올려준다고 하셨습니다.

### 본인 프로젝트 소개

저는 볼펜을 주제로 3차원 제품 카탈로그를 제작했고, 상위 30% 프로젝트에 선정되었습니다.

다른 과목들과 다르게, 최종 레포트를 **PPT 형식**으로 제출하는 것이 양식이었습니다.

아래는 최종 제출한 PPT인데, 일부 페이지가 생략되어 있습니다.

![ppt2](/assets/posts/2023-03-07-computer-graphics-review/ppt2.jpg)
![ppt3](/assets/posts/2023-03-07-computer-graphics-review/ppt3.jpg)

볼펜은 상대적으로 **모델링**이 쉽기 때문에 **동적인 구현**에 시간을 더 많이 쏟을 수 있어 프로젝트 주제를 볼펜으로 선정했습니다.

![ppt4](/assets/posts/2023-03-07-computer-graphics-review/ppt4.jpg)
![ppt5](/assets/posts/2023-03-07-computer-graphics-review/ppt5.jpg)
![ppt6](/assets/posts/2023-03-07-computer-graphics-review/ppt6.jpg)

동적인 기능이 치중하여 **구현사양**을 기획했습니다.

![ppt10](/assets/posts/2023-03-07-computer-graphics-review/ppt10.jpg)
![ppt11](/assets/posts/2023-03-07-computer-graphics-review/ppt11.jpg)
![ppt12](/assets/posts/2023-03-07-computer-graphics-review/ppt12.jpg)

Blender를 이용해 볼펜을 **모델링**한 과정입니다.

![ppt15](/assets/posts/2023-03-07-computer-graphics-review/ppt15.jpg)
![ppt16](/assets/posts/2023-03-07-computer-graphics-review/ppt16.jpg)

실습시간에 제공받은 코드를 **객체지향**적으로 수정하고, **RAII**를 이용해 **메모리**와 관련된 버그도 수정했습니다.

참고: [스마트 포인터: 저수준에서 가비지 컬렉션을 추구하면 안 되는 걸까](https://int-i.github.io/cpp/2023-01-20/smart-pointer/)

![ppt18](/assets/posts/2023-03-07-computer-graphics-review/ppt18.jpg)
![ppt19](/assets/posts/2023-03-07-computer-graphics-review/ppt19.jpg)

볼펜 그리기 모드 테스트 과정입니다.

![ppt21](/assets/posts/2023-03-07-computer-graphics-review/ppt21.jpg)

볼펜 딸각이는 소리도 직접 녹음해서 **효과음**으로 넣었습니다.

![ppt24](/assets/posts/2023-03-07-computer-graphics-review/ppt24.jpg)

로고 텍스처만 따로 만들어 여러 색상의 볼펜의 맞는 **텍스처를 동적으로 생성**하여 리소스를 아낄 수 있도록 구현했습니다.

![ppt26](/assets/posts/2023-03-07-computer-graphics-review/ppt26.jpg)

볼펜으로 그린 그림을 `.bmp` 형식의 파일로 저장하는 기능을 구현했습니다.

![ppt29](/assets/posts/2023-03-07-computer-graphics-review/ppt29.jpg)

`wglUseFontBitmapsW`을 이용해 한글 텍스트를 그렸습니다.

해당 프로젝트 소스코드는 [ICE3016-miniproject](https://github.com/Astro36/ICE3016-miniproject)에서 확인하실 수 있습니다.

**FreeGLUT**도 실습시간에 제공한 라이브러리보다 **최신버전**인 v3.4.0로 설정되어 있습니다.

FreeGLUT 최신버전이 필요하다면 [FreeGLUT Prebuilt Library](https://github.com/Astro36/freeglut-prebuilt)를 확인해 주시길 바랍니다.

위 링크의 라이브러리는 제가 FreeGLUT 소스코드를 다운로드 받아 **직접 빌드**한 라이브러리입니다.

참고: [Visual Studio에서 FreeGLUT 빌드하는 방법](https://int-i.github.io/c/2023-01-03/visual-studio-freeglut/)

아래 영상은 **최종 프로젝트 발표 영상**입니다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/zj_bYKwh2dY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
