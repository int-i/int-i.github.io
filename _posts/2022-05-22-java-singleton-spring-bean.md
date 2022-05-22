---
title: "객체는 언제나 하나! Singleton과 Spring Bean"
date: 2022-05-22
author: Astro36
category: java
tags: [java, spring, springboot, bean, singleton, design_pattern]
thumbnail: /assets/posts/2022-05-22-java-singleton-spring-bean/thumbnail.jpg
---

소프트웨어 디자인 패턴에서 **싱글톤(Singleton) 패턴**은 생성자가 여러 차례 호출되더라도 **실제로 생성되는 객체는 하나**이고 최초 생성 이후에 호출된 생성자는 **최초의 생성자가 생성한 객체를 재사용**하는 형태를 말합니다.

프로그램 내에서 **객체가 단 하나만 존재**하는 것이 보장되야 하거나, 객체의 크기가 커서 **여러 번 재사용**해야 하는 경우에 주로 사용됩니다.

싱글톤 패턴의 구현 방법으로는 크게 2가지가 있습니다.

## `static`과 `synchronized` 이용

```java
public class Singleton {
    private volatile static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

`instance`가 아직 **초기화되지 않았을 때**만 `synchronized` 블록을 호출해 쓰레드 간 **동기화 오버헤드**를 줄이는 방법입니다.

또한, `volatile`을 이용해 **재배치(Reordering) 문제**가 생기지 않게 합니다.

참고: [Java volatile이란?](https://nesoy.github.io/articles/2018-06/Java-vol)

## LazyHolder 이용

```java
public class Singleton {
    private Singleton() {}

    public static Singleton getInstance() {
        return LazyHolder.INSTANCE;
    }

    private static class LazyHolder {
        private static final Singleton INSTANCE = new Singleton();
    }
}
```

프로그램이 실행된 직후에는 `Singleton`에 `LazyHolder`와 관련된 변수가 아직 없으므로 `LazyHolder`는 **초기화되지 않습니다.**

하지만, `getInstance`가 호출되면 `LazyHolder.INSTANCE`가 **참조**되면서 `LazyHolder`가 **초기화**되며 `INSTANCE`가 **생성**됩니다.

효율적이며 싱글톤 패턴 구현 시 **추천되는 방법**입니다.

## Spring Bean

**스프링 컨테이너**에서 생성되어 관리되는 **핵심 객체**를 **스프링 빈**(Bean)이라고 합니다.

빈을 등록할 때, 아무런 설정을 하지 않으면 기본적으로 **싱글톤 스코프**(Scope)로 생성됩니다.

싱글톤 스코프는 프로그램에서 해당 **빈의 인스턴스를 오직 하나만 생성**해서 재사용하는 것을 말합니다.

```java
@Component
public class Singleton {
}
```

싱글턴 스코프는 **상태를 저장하지 않고 로직만 존재**하는 경우에 선택하는 것이 좋습니다.

로직만을 처리할 경우 매번 객체를 생성해줄 필요 없이 **이전 객체를 재사용**하는 것이 효율적이기 때문입니다.

참고: [Spring Bean Scope 종류 | Bean | Singleton | Prototyoe | Request | Session | Application](https://yhmane.tistory.com/m/221)
