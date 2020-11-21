---
title: "Spring Boot: Options -Xverify:none and -noverify were deprecated in JDK 13 and will likely be removed in a future release."
date: 2020-11-21
author: Astro36
category: java
tags: [java, jdk, openjdk, jdk13, jdk15, intellij, spring, spring_boot, noverify, deprecated]
---

```txt
OpenJDK 64-Bit Server VM warning: Options -Xverify:none and -noverify were deprecated in JDK 13 and will likely be removed in a future release.
```

해당 경고는 JDK13에서 `-Xverify:none`와 `-noverify` 옵션이 제거되면서 발생하는 오류입니다.

참고: [JDK-8214719 : Deprecate -Xverify:none option](https://bugs.java.com/bugdatabase/view_bug.do?bug_id=JDK-8214719)

![Edit Configurations](/assets/posts/2020-11-21-openjdk-noverify-deprecated.md/edit-configurations.png)

[Intellij](https://www.jetbrains.com/ko-kr/idea/)의 우측 상단 버튼이 모여있는 곳에서 "Edit Configurations..."를 찾아 열어줍니다.

![Launch Optimization](/assets/posts/2020-11-21-openjdk-noverify-deprecated.md/launch-optimization.png)

Spring Boot 항목의 "Enable Launch Optimization"을 체크 해제하면 경고가 사라집니다.
