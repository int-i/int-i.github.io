title: "자바 시작하기"
date: 2021-04-29
author: yeonha99
category: JAVA
tags: [JAVA,eclipse]
- 자바 프로그래밍 시작하기

    자바는 플랫폼에 영향을 받지 않으므로 다양한 확경에서 사용할 수 있다.

    자바는 운영체제에서 직접 실행하는 게 아니라 가상 머신에서 먼저 실행하고 이 가상 머신이 운영체제에 맞는 실행 파일로 바꿔준다.

    자바는 객체 지향 언어라서 유지보수가 쉽고 확장성이 좋다.

    자바는 가비지 컬렉터를 이용하므로 메모리를 효율적으로 관리 할 수 있다.
    
    자바 설치:https://www.oracle.com/technetwork/java/javase/downloads/index.html
    이클립스 설치:https://www.eclipse.org/
    
    이클립스에서 프로젝트 생성하는 방법
    **[File] - [New] - [Java Project]** 를 선택합니다

    만약 [Java Project] 메뉴가 보이지 않는다면[Window] - [Perspective] - [Open Perspective] - [Java] 메뉴를 선택

- 변수와 자료형

    변수 이름은 숫자로 시작 할 수 없다.

    byte는 1바이트로 8비트이다. 범위는 -128~127이다.

    short 2바이트

    int 4바이트

    long을 사용 할 때는 뒤에 L을 붙여서 long형임을 나타내 줘야 한다.

    자바에서는 boolean을 사용한다.

    var는 auto와 같은 역할을 한다.

    자바에서는 const를 final이라고 선언해서 사용한다.

    묵시적 형 변환:바이트가 작은 자료형이 큰 자료형으로 대입하는 경우

    명시적 형 변환 바이트 크기가 큰 자료형에서 작은 자료형으로 대입하는 경우 (int)와 같이 사용
