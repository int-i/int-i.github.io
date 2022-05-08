---
title: "Gradle과 함께 Spring Boot 시작하기"
date: 2022-05-08
author: Astro36
category: java
tags: [java, jdk, eclipse, temurin, adoptium, sdkman, spring, springboot, web, maven, gradle]
thumbnail: /assets/posts/2022-01-29-sdkman-kotlin-install/thumbnail.jpg
---

[Spring Boot](https://spring.io/projects/spring-boot)는 [Spring](https://spring.io/)에 필요한 **의존성과 설정, 웹 서버를 통합적으로 제공**하는 도구입니다.

그렇기에 Spring 프레임워크를 이용해 **프로젝트를 시작**할 때는 **Spring Boot의 도움**을 받는 것을 추천합니다.

Spring Boot에서는 [Spring Initializr](https://start.spring.io/)를 통해 **프로젝트 템플릿**을 제공합니다.

Spring Initializr 사이트에 들어가면 가장 먼저 **어떤 빌드 도구를 사용**할지 선택하는 체크박스가 보입니다.

Java 프로젝트의 **빌드 도구**에는 대표적으로 Maven과 Gradle가 있습니다.

[Maven](https://maven.apache.org/)은 **아파치 소프트웨어 재단**에서 개발한 빌드 도구로, `pom.xml` 파일을 이용해 **프로젝트 라이브러리**를 관리합니다.

> POM은 Project Object Model의 약자로, `pom.xml`은 **프로젝트 정보**를 저장합니다.

**대중적**이기에 그동안 꾸준히 Java 프로젝트에서 사용되어 왔지만, 프로젝트 라이브러리 **설정이 복잡**해질 경우 `pom.xml` 파일의 **가독성**이 낮아지기 때문에 **새로운 빌드 도구 Gradle**이 나오게 되었습니다.

Gradle은 **안드로이드 스튜디오 공식 빌드 도구**로 지정될 만큼, **강력한 성능**과 **쉬운 설정**으로 Maven의 자리를 빠르게 대체하고 있습니다.

참고: [Gradle vs Maven Comparison](https://gradle.org/maven-vs-gradle/)

특히, **빌드 시간**의 경우 Maven 대비 최대 **100배 빠른 성능**을 보여주고 있습니다.

참고: [Gradle vs Maven: Performance Comparison](https://gradle.org/gradle-vs-maven-performance/)

빌드 도구를 선택했다면, 그 밑은 **사용하는 언어**와 **Spring Boot의 버전**을 선택하면 됩니다.

Language은 Java을 선택하면 되고,

Spring Boot는 SNAPSHOT, M, RC을 제외한 **최신 버전**을 선택하면 됩니다.

> Snapshot=개발 중
>
> M=Milestone=기능 일부 완성
>
> RC=Release Candidate=테스트가 거의 완료된 개발 버전

Project Metadata에는 적절히 **프로젝트 기초 정보**를 넣어주면 됩니다.

Packaging에는 JAR(Java Archive)과 WAR(Web Application Archive)이 있는데, **JAR을 선택**하면 됩니다.

> WAR은 **웹 컨테이너**에서 구동시키는 압축 포맷입니다.
>
> 참고: [(JAVA) JAR ? WAR ? 차이점 알아보자](https://joohoon.tistory.com/96)

Java 버전은 17을 선택하면 되는데, 현재 Gradle이 **Java 18 버전을 아직 지원하지 않기 때문**입니다. (2022년 5월 8일 기준) 

마지막으로 Dependencies는 **Spring Web을 선택**하면 됩니다.

Spring Web을 선택하면 `spring-boot-starter-web` 의존성이 추가되는데,

`spring-boot-starter-web`은 `spring-boot-starter`, `spring-boot-starter-json`, `spring-boot-starter-tomcat`, `spring-web`, `spring-webmvc`을 포함하고 있는 **웹 개발 의존성 종합선물세트**라고 생각하면 됩니다.

의존성 선택까지 끝난다면 Generate 버튼을 눌러 **템플릿 파일을 다운로드** 받으면 됩니다.

다운로드가 끝나면 압축을 풀고 **Gradle를 실행**해봅니다.

```txt
$ gradle build
BUILD SUCCESSFUL in 47st com.example.demo.DemoApplicationTests
7 actionable tasks: 5 executed, 2 up-to-date
```

> 만약 컴퓨터에 **Gradle이 설치**되어 있지 않다면, 아래 글을 참고해 **SDKMAN!을 설치**해주세요.
>
> 참고: [확실히 SDKMAN! 쓰고 나서 내 인생이 달라졌다: SDKMAN!을 이용한 Kotlin 설치](https://int-i.github.io/kotlin/2022-01-29/sdkman-kotlin-install/)
>
> 그리고 아래 명령어로 **Gradle을 설치**합니다.
>
> ```txt
> $ sdk install gradle
> ```

이제 템플릿이 잘 작동하는 확인해 봅시다.

`DemoApplication.java` 파일을 아래와 같이 **수정**합니다.

`src/main/java/com/example/demo/DemoApplication.java`

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return String.format("Hello %s!", name);
    }
}
```

수정이 끝났다면 Gradle을 실행합니다.

이번엔 빌드 후 **프로젝트 실행**까지 시켜볼 겁니다.

```txt
$ gradle bootRun
```

문제없이 여기까지 따라왔다면, `localhost:8080/hello`에서 "Hello World" 나오는 것을 확인할 수 있습니다.
