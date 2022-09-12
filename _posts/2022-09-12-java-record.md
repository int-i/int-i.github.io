---
title: "Data Class, Java 문법이 돼라: Record"
date: 2022-09-12
author: Astro36
category: java
tags: [java, kotlin, record, lombok]
thumbnail: /assets/posts/2022-09-12-java-record/thumbnail.jpg
---

Kotlin의 [Data class](https://kotlinlang.org/docs/data-classes.html)는 **데이터 저장** 목적으로 만든 클래스를 위한 문법입니다.

Data class는 `toString()`, `hashCode()`, `equals()` 등의 메소드를 **자동으로 구현**해주기 때문에, 간단하게 **DTO(Data Transfer Object)등의 클래스**를 만들 때 자주 이용합니다.

Java에서는 그동안 [Lombok](https://projectlombok.org/)이 Data class의 역할을 **대신**해 왔지만,

JDK 14에서 `record` 등장하면서 **외부 라이브러리 없이**도 간단한 DTO 클래스를 만들 수 있게 되었습니다.

참고: [Lombok: 너네 Data class 얼마든지 써~ 왜냐면 나는 부럽지가 않어](https://int-i.github.io/java/2022-05-15/java-lombok/)

## Record

Record는 JDK 14에서 Preview 기능으로 등장해서 **JDK 16에서 정식 기능**에 포함되었습니다.

```java
class Point {
    private final int x;
    private final int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    int x() { return x; }
    int y() { return y; }

    public boolean equals(Object o) {
        if (!(o instanceof Point)) return false;
        Point other = (Point) o;
        return other.x == x && other.y == y;
    }

    public int hashCode() {
        return Objects.hash(x, y);
    }

    public String toString() {
        return String.format("Point[x=%d, y=%d]", x, y);
    }
}
```

위 `Point` 클래스를 `record`로 정의하면 아래와 같습니다.

```java
record Point(int x, int y) { }
```

멤버 변수는 **항상** `final`로 정의됩니다.

> **도메인 주도 설계**에 따르면 VO(Value Object)는 불변(Immutable)해야 하기에, 멤버 변수가 `final`로 정의할 수 없는 경우는 소프트웨어의 구조를 검토하길 권장합니다.

> DTO는 VO와 다른 개념이지만, 데이터를 다루는 관점에서 **불변성을 유지**하는 것이 코드 유지보수에 유리합니다.
>
> 참고: [VO vs DTO](https://ijbgo.tistory.com/9)

생성자에서 **입력값을 검사**해야 하는 경우 아래와 같이 선언합니다.

```java
record Range(int lo, int hi) {
    Range {
        if (lo > hi)  // referring here to the implicit constructor parameters
            throw new IllegalArgumentException(String.format("(%d,%d)", lo, hi));
    }
}
```

`record`에 **메소드를 정의**하는 경우는 아래와 같이 선언합니다.

```java
record SmallPoint(int x, int y) {
    public int x() { return this.x < 100 ? this.x : 100; }
    public int y() { return this.y < 100 ? this.y : 100; }
}
```

멤버 변수에 **어노테이션**(Annotation)을 붙이는 경우는 아래와 같이 선언합니다.

```java
record Card(@MyAnno Rank rank, @MyAnno Suit suit) { }
```

`record`는 **상속이 불가**능한 **final 클래스**이며, 추상 클래스가 될 수 없습니다.

참고: [자바 #23 final 키워드(클래스, 메소드)](https://sas-study.tistory.com/60)

마찬가지로 다른 클래스를 상속할 수도 없지만, **인터페이스는 상속**할 수 있습니다.

```java
public record Data(int x, int y) implements Runnable, Serializable
```

참고: [JEP 395: Records](https://openjdk.org/jeps/395)

참고: [Understanding Java Records From Java 16](https://dzone.com/articles/what-are-java-records)
