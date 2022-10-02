---
title: "Logger는 사드세요... 제발: SLF4J와 Logback"
date: 2022-10-02
author: Astro36
category: java
tags: [java, gradle, logger, slf4j, lockback, log4j]
thumbnail: /assets/posts/2022-10-02-slf4j-logback/thumbnail.jpg
---

자바의 **로깅(Logging) 라이브러리**로는 [Log4j](https://logging.apache.org/log4j/2.x/) 등 다양한 종류가 있지만, 현재 **가장 좋은 조합**은 **SLF4J+Logback**이라고 생각합니다.

[SLF4J](https://www.slf4j.org/)는 **Simple Logging Facade for Java**의 약자로 라이브러리 [인터페이스](https://ko.wikipedia.org/wiki/%ED%8D%BC%EC%82%AC%EB%93%9C_%ED%8C%A8%ED%84%B4) 역할이며,

[Logback](https://logback.qos.ch/)이 실질적인 **로깅 라이브러리 구현체**로,

SLF4J는 **Logback를 사용하기 쉽게 포장**하는 역할을 합니다.

**Logback**은 **Log4j v1을 포크(Fork)해서 개발**한 버전으로, 통상 **Log4j**라 불리는 Log4j v2와 다릅니다.

참고: [Reasons to prefer logback over log4j 1.x](https://logback.qos.ch/reasonsToSwitch.html)

참고: [Log4j, LogBack 정리](https://goddaehee.tistory.com/45)

## 설치

이 글에서는 Gradle을 이용해 라이브러리 종속성을 추가할 것입니다.

- [org.slf4j:slf4j-api](https://mvnrepository.com/artifact/org.slf4j/slf4j-api)
- [ch.qos.logback:logback-classic](https://mvnrepository.com/artifact/ch.qos.logback/logback-classic)

```groovy
dependencies {
    implementation 'ch.qos.logback:logback-classic:1.4.1'
    implementation 'org.slf4j:slf4j-api:2.0.3'
}
```

> Java 11 버전 이상이면 Logback 1.4를 사용하면 됩니다.

## 사용

```java
package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {
    public static void main(String[] args) {
        Logger logger = LoggerFactory.getLogger("org.example.Main");
        logger.debug("Hello world.");
    }
}
```

SLF4J는 **클래스 별**로 Logger를 사용합니다.

> 이름을 통해 **어디에서 오류가 발생**했는지 추적할 수 있습니다.

```txt
> Task :compileJava
> Task :processResources NO-SOURCE
> Task :classes

> Task :Main.main()
21:16:58.694 [main] DEBUG org.example.Main - Hello world.
```

```java
package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {
    public static void main(String[] args) {
        Logger logger = LoggerFactory.getLogger("org.example.Main");
        int newT = 15;
        int oldT = 16;
        logger.debug("Temperature set to {}. Old value was {}.", newT, oldT);
        logger.atDebug().log("Temperature set to {}. Old value was {}.", newT, oldT);
    }
}
```

`.debug`는 `.atDebug().log`와 동일합니다.

## 설정

Logback에서는 로그의 **출력 형식**을 지정할 수 있습니다.

`resources/logback.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

콘솔 출력과 동시에 **파일에 로그**를 기록할 수 있습니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="FILE" class="ch.qos.logback.core.FileAppender">
        <file>logFile.log</file>
        <encoder>
            <pattern>%date %level [%thread] %logger{10} [%file:%line] %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="FILE" />
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

`RollingFileAppender`를 이용하면 로그파일이 너무 커지지 않도록 나눌 수 있습니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logFile.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logFile.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
            <totalSizeCap>3GB</totalSizeCap>
        </rollingPolicy>

        <encoder>
            <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="DEBUG">
        <appender-ref ref="FILE" />
    </root>
</configuration>
```

> 30일/3GB 단위로 로그파일을 분리하는 설정입니다.

`RollingFileAppender`에 `<prudent>true</prudent>`를 넣으면 파일을 저장할 때 lock을 겁니다.

참고: [Logback 으로 쉽고 편리하게 로그 관리를 해볼까요?](https://tecoble.techcourse.co.kr/post/2021-08-07-logback-tutorial/)

참고: [The logback manual](https://logback.qos.ch/manual/configuration.html)
