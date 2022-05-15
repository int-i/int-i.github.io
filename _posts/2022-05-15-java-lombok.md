---
title: "Lombok: 너네 Data class 얼마든지 써~ 왜냐면 나는 부럽지가 않어"
date: 2022-05-15
author: Astro36
category: java
tags: [java, kotlin, maven, gradle, lombok]
thumbnail: /assets/posts/2022-05-15-java-lombok/thumbnail.jpg
---

[Lombok](https://projectlombok.org/)은 Getter/Setter 등 **반복되는 코드를 어노테이션(Annotation)을 이용해 자동으로 작성**해주는 Java **라이브러리**입니다.

Kotlin의 [Data class](https://kotlinlang.org/docs/data-classes.html)와 유사하지만 더 **많은 기능**을 제공합니다.

Lombok을 사용함으로써 **반복되는 코드를 줄이고 가독성을 향상**시킬 수 있지만, 반복되는 코드를 숨김으로써 직관성이 떨어지기에 호불호가 있을 수 있습니다.

## 설치

[Gradle](https://gradle.org/)에서는 **플러그인을 이용해 설치**하는 것을 권장합니다.

Gradle 설치 방법 참고: [Gradle과 함께 Spring Boot 시작하기](https://int-i.github.io/java/2022-05-08/spring-quickstart-gradle/)

```groovy
plugins {
  id "io.freefair.lombok" version "6.4.3"
}
```

참고: [Gradle Plugin:io.freefair.lombok](https://plugins.gradle.org/plugin/io.freefair.lombok)

플러그인을 사용할 수 없는 경우, `dependencies`를 이용해 추가합니다.

```groovy
repositories {
  mavenCentral()
}

dependencies {
  compileOnly 'org.projectlombok:lombok:1.18.24'
  annotationProcessor 'org.projectlombok:lombok:1.18.24'

  testCompileOnly 'org.projectlombok:lombok:1.18.24'
  testAnnotationProcessor 'org.projectlombok:lombok:1.18.24'
}
```

[Maven](https://maven.apache.org/)에서는 아래와 같이 추가합니다.

```xml
<dependencies>
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.24</version>
    <scope>provided</scope>
  </dependency>
</dependencies>
```

## 사용

### `@Getter`/`@Setter`

클래스 멤버 변수의 **Getter/Setter 함수**를 자동으로 작성합니다.

```java
public class Example {
    @Getter @Setter
    private int number = 10;
}
```

### `@NoArgsConstructor`/`@RequiredArgsConstructor`/`@AllArgsConstructor`

클래스 멤버 변수를 바탕으로 **생성자**를 작성합니다.

```java
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class Example {
    @NonNull private int a = 10;
    private int b = 20;
}
```

### `@EqualsAndHashCode`

**객체 비교**에 사용되는 `equals`와 `hashCode` 함수를 작성합니다.

```java
@EqualsAndHashCode
public class Example {
    private int number = 10;
}
```

### `@ToString`

클래스 **이름과 멤버 변수 값을 출력**하는 `toString` 함수를 작성합니다.

```java
@ToString
public class Example {
    private int number = 10;
}
```

### `@Data`

클래스에 `@ToString`, `@EqualsAndHashCode`, `@RequiredArgsConstructor`를 적용하고,

모든 멤버 변수에 `@Getter`를, Null이 아닌 멤버 변수에 `@Setter`를 적용합니다.

```java
@Data
public class Example {
    private int number = 10;
}
```

### `@Value`

**수정할 수 없는** `@Data`입니다.

```java
@Value
public class Example {
    private int number = 10;
}
```
