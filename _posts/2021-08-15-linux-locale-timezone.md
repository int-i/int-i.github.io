---
title: "Debian과 Ubuntu에서 펀쿨섹하게 Locale과 Timezone 설정하기"
date: 2021-08-15
author: Astro36
category: linux
tags: [linux, ubuntu, debian, korean, locale, timezone, docker]
thumbnail: /assets/posts/2021-08-15-linux-locale-timezone/thumbnail.jpg
---

> 로케일(Locale): 사용자의 언어, 국가, 인터페이스 출력 형식을 지정한 문자열

## 로케일 설정

리눅스에서 로케일은 기본적으로 `POSIX`로 설정되어 있습니다.

**현재 로케일을 확인**하기 위해서는 `locale` 명령을 이용하면 됩니다.

```txt
$ locale
LANG=
LANGUAGE=
LC_CTYPE="POSIX"
LC_NUMERIC="POSIX"
LC_TIME="POSIX"
LC_COLLATE="POSIX"
LC_MONETARY="POSIX"
LC_MESSAGES="POSIX"
LC_PAPER="POSIX"
LC_NAME="POSIX"
LC_ADDRESS="POSIX"
LC_TELEPHONE="POSIX"
LC_MEASUREMENT="POSIX"
LC_IDENTIFICATION="POSIX"
LC_ALL=
```

참고: [man locale](https://linux.die.net/man/7/locale)

출력 결과를 간단하게 살펴보면, `LANG`, `LANGUAGE`, `LC_*`, `LC_ALL`로 나눌 수 있습니다.

> 여기서 `LANGUAGE`는 GNU 확장에서 사용하는 변수이므로 여기서는 제외하겠습니다.
>
> 참고: [man gettext](https://linux.die.net/man/3/gettext)

그러면 남은 것은 `LANG`, `LC_*`, `LC_ALL`인데, 로케일의 우선순위는 `LANG < LC_* < LC_ALL`입니다.

각 변수에 대한 자세한 설명은 아래에 있습니다.

참고: [로케일(Locale)이란](https://linuxism.ustd.ip.or.kr/m/557)

그러면 이제 `POSIX`로 설정된 로케일을 한국어로 변경해볼 것입니다.

`locale -a`를 통해 **사용가능한 로케일 목록을 출력**합니다.

```txt
# locale -a
C
C.UTF-8
POSIX
```

한국어는 `ko_KR`로 표시되지만 아쉽게도 사용가능한 **로케일 목록에서 찾을 수 없습니다.**

따라서 **한국어 로케일을 직접 설치해 추가**할 필요가 있어 보입니다.

로케일을 추가하는데 필요한 `locales` **패키지를 설치**합니다.

```txt
$ sudo apt update
$ sudo apt install locales
```

이제 **한국어 로케일을 정의**하고 `ko_KR.UTF-8`이란 이름으로 저장합니다.

```txt
$ localedef -f UTF-8 -i ko_KR ko_KR.UTF-8
```

참고: [man localedef](https://linux.die.net/man/1/localedef)

> 주의: `locale-gen`을 통한 로케일 생성도 가능하지만, **데비안과 우분투에서 동작의 차이**가 있어 좀 더 직관적인 `localedef`를 사용했습니다.

로케일이 생성되면 다시 사용가능한 로케일 목록을 출력해봅니다.

```txt
# locale -a
C
C.UTF-8
POSIX
ko_KR.utf8
```

한국어 로케일이 정상적으로 출력된 것을 확인할 수 있습니다.

생성된 한국어 로케일을 환경변수로 설정하기만하면 로케일 설정이 완료됩니다.

```txt
$ export LC_ALL=ko_KR.UTF-8
```

`LC_ALL`의 우선순위가 가장 높기 때문에 **다른 변수는 설정하기 않아도** 됩니다.

```txt
$ locale
LANG=
LANGUAGE=
LC_CTYPE="ko_KR.UTF-8"
LC_NUMERIC="ko_KR.UTF-8"
LC_TIME="ko_KR.UTF-8"
LC_COLLATE="ko_KR.UTF-8"
LC_MONETARY="ko_KR.UTF-8"
LC_MESSAGES="ko_KR.UTF-8"
LC_PAPER="ko_KR.UTF-8"
LC_NAME="ko_KR.UTF-8"
LC_ADDRESS="ko_KR.UTF-8"
LC_TELEPHONE="ko_KR.UTF-8"
LC_MEASUREMENT="ko_KR.UTF-8"
LC_IDENTIFICATION="ko_KR.UTF-8"
LC_ALL=ko_KR.UTF-8
```

참고: [로케일(Locale)이란? 국가 및 언어 설정](https://www.44bits.io/ko/keyword/locale)

## 시간대 설정

시간대(Timezone) 설정은 로케일보다 훨씬 쉽습니다.

`tzselect` 명령을 이용해 시간대를 찾아도 되지만, 한국의 시간대는 `Asia/Seoul`임이 자명하므로 **직접 환경변수를 입력**합니다.

```txt
$ export TZ='Asia/Seoul'
```

`date` 명령으로 시간이 잘 설정되었는지 확인합니다.

```txt
$ date
2021. 08. 15. (일) 15:38:25 KST
```

참고: [리눅스 타임존(Linux timezone)을 변경하는 tzselect 명령어](https://www.lesstif.com/system-admin/linux-timezone-tzselect-20775293.html)
