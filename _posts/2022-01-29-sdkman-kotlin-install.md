---
title: "확실히 SDKMAN! 쓰고 나서 내 인생이 달라졌다: SDKMAN!을 이용한 Kotlin 설치"
date: 2022-01-29
author: Astro36
category: kotlin
tags: [java, jdk, eclipse, temurin, adoptium, sdkman, kotlin]
thumbnail: /assets/posts/2022-01-29-sdkman-kotlin-install/thumbnail.jpg
---

[SDKMAN!](https://sdkman.io/)는 **유닉스 기반 시스템**에서 소프트웨어 개발 키트(SDK)의 **버전을 관리**해주는 도구입니다.

이 글에서는 SDKMAN!을 이용해 **리눅스**에 **[Kotlin](https://kotlinlang.org/)을 설치**하는 방법을 알아볼 것입니다.

우선 SDKMAN!을 설치합니다.
cURL을 이용해 **설치 스크립트를 다운받아 실행**하면 간단하게 완료됩니다.

```txt
$ curl -s "https://get.sdkman.io" | bash
...
Extract script archive...
Install scripts...
Set version to 5.13.1 ...
Attempt update of interactive bash profile on regular UNIX...
Added sdkman init snippet to /home/ubuntu/.bashrc
Attempt update of zsh profile...
Updated existing /home/ubuntu/.zshrc

All done!

Please open a new terminal, or run the following in the existing one:

    source "/home/ubuntu/.sdkman/bin/sdkman-init.sh"

Then issue the following command:

    sdk help

Enjoy!!!
```

> 설치 중 아래와 같은 문제가 발생한다면 "Not found"인 패키지를 직접 설치해주세요.
>
> ```txt
> Looking for a previous installation of SDKMAN...
> Looking for unzip...
> Looking for zip...
> Not found.
> ======================================================================================================
>  Please install zip on your system using your favourite package manager.
> 
>  Restart after installing zip.
> ======================================================================================================
> ```
>
> `zip` 패키지는 `apt install`을 이용해 설치할 수 있습니다.
>
> ```txt
> $ sudo apt install zip
> ```

설치 스크립트로 **변경된 사항**을 적용합니다.

```txt
source "/home/ubuntu/.sdkman/bin/sdkman-init.sh"
```

SDKMAN!이 정상적으로 **설치**되었는지 확인합니다.

```
$ sdk version
==== BROADCAST =================================================================
* 2022-01-28: groovy 4.0.0 available on SDKMAN!
* 2022-01-27: micronaut 3.3.0 available on SDKMAN!
* 2022-01-27: ki 0.4.5 available on SDKMAN! https://github.com/Kotlin/kotlin-interactive-shell/releases/tag/v0.4.5
================================================================================

SDKMAN 5.13.1
```

정상적으로 설치된 것을 **확인**했으니, 다음 단계로 넘어갑니다.

Kotlin 코드를 실행하기 위해서는 **JVM이 필요**하기 때문에, 먼저 **Java를 설치**해야 합니다.

`sdk list`를 이용해 SDKMAN!으로 설치 가능한 **버전 목록**을 볼 수 있습니다.

```txt
$ sdk list java
================================================================================
Available Java Versions for Linux ARM 64bit
================================================================================
 Vendor        | Use | Version      | Dist    | Status     | Identifier
--------------------------------------------------------------------------------
 AdoptOpenJDK  |     | 8.0.275+1.hs | adpt    |            | 8.0.275+1.hs-adpt  
...
 Temurin       |     | 17.0.1       | tem     |            | 17.0.1-tem         
               |     | 11.0.14      | tem     |            | 11.0.14-tem        
               |     | 11.0.13      | tem     |            | 11.0.13-tem        
               |     | 8.0.322      | tem     |            | 8.0.322-tem        
               |     | 8.0.312      | tem     |            | 8.0.312-tem        
 Zulu          |     | 17.0.2       | zulu    |            | 17.0.2-zulu        
               |     | 17.0.1       | zulu    |            | 17.0.1-zulu        
               |     | 11.0.14      | zulu    |            | 11.0.14-zulu       
               |     | 11.0.13      | zulu    |            | 11.0.13-zulu       
               |     | 8.0.322      | zulu    |            | 8.0.322-zulu       
               |     | 8.0.312      | zulu    |            | 8.0.312-zulu       
================================================================================
Omit Identifier to install default version 17.0.1-tem:
    $ sdk install java
Use TAB completion to discover available versions
    $ sdk install java [TAB]
Or install a specific version by Identifier:
    $ sdk install java 17.0.1-tem
Hit Q to exit this list view
================================================================================
```

많고 많은 Java 버전 중에 [Eclipse Temurin](https://adoptium.net/)이 일반적으로 **추천**되곤 합니다.

Eclipse Temurin은 [AdoptOpenJDK](https://adoptopenjdk.net/)의 **후속 프로젝트**로, **Adoptium에서 개발** 중인 JDK입니다.

JDK 선택에 관한 자세한 내용은 [Which Version of JDK Should I Use?](http://whichjdk.com/)를 읽어보면 도움이 될 것 같습니다.

참고: [JDK17 이제는 AdoptOpenJDK 대신 Eclipse Temurin 사용](https://revf.tistory.com/m/253?category=314045)

```txt
$ sdk install java 17.0.1-tem
...
$ java --version
openjdk 17.0.1 2021-10-19
OpenJDK Runtime Environment Temurin-17.0.1+12 (build 17.0.1+12)
OpenJDK 64-Bit Server VM Temurin-17.0.1+12 (build 17.0.1+12, mixed mode, sharing)
ubuntu@ubuntu:~$ javac --version
javac 17.0.1
```

Java 설치가 끝나면 **Kotlin을 설치**할 차례입니다.

```txt
$ sdk install kotlin
...
$ kotlinc -version
info: kotlinc-jvm 1.6.10 (JRE 17.0.1+12)
```

Hello World 코드를 작성해 프로그램에 문제가 없는지 확인해봅니다.

`hello.kt`:

```kt
fun main() {
    println("Hello, World!")
}
```

```txt
$ kotlinc hello.kt -include-runtime -d hello.jar
$ java -jar hello.jar
Hello, World!
```

**끝!**
