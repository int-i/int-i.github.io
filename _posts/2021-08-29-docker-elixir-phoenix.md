---
title: "Docker로 Elixir Phoenix 앱 배포"
date: 2021-08-14
author: Astro36
category: elixir
tags: [elixir, phoenix, docker, alpine]
thumbnail: /assets/posts/2021-08-29-docker-elixir-phoenix/thumbnail.jpg
---

[엘릭서(Elixir)](https://elixir-lang.org/)는 얼랭(Erlang)VM에서 동작하는 **함수형/동시성 프로그래밍 언어**입니다.

[피닉스(Phoenix)](https://phoenixframework.org/)는 엘릭서(Elixir)로 작성된 **MVC 웹 프레임워크**로, Ruby on Rails와 Django를 사용했다면 구조가 비슷해 쉽게 입문할 수 있습니다.

엘릭서에서는 [`mix release`](https://hexdocs.pm/mix/Mix.Tasks.Release.html)를 이용해 **독립적인(self-contained) 앱**으로 컴파일할 수 있습니다.

도커(Docker)는 **컨테이너**라는 가상 실행 환경 위에서 사용자의 코드를 실행할 수 있는 **가상화 기술**로, 도커를 이용해 엘릭서 앱을 배포해보겠습니다.

## Dockerfile

도커에서는 이미 공식적으로 [엘릭서 이미지](https://hub.docker.com/_/elixir)를 제공하기 때문에 이것을 가져다 사용하면 됩니다.

```txt
# syntax=docker/dockerfile:1
FROM elixir:alpine AS build
```

**저장 공간**을 줄이기 위해 `alpine` 이미지를 이용했습니다.

참고: [효율적인 도커 이미지 만들기](https://bcho.tistory.com/m/1356)

```txt
WORKDIR /usr/src/app_name

ENV MIX_ENV prod
```

빌드 환경의 기초가 되는 `WORKDIR`과 환경변수(`MIX_ENV=prod`)를 정의합니다.

```txt
RUN mix do local.hex --force, local.rebar --force
```

그리고 `Hex`와 `rebar`을 설치합니다.

**도커의 레이어 캐시**를 활용하기 위해, [`mix do`](https://hexdocs.pm/mix/Mix.Tasks.Do.html)로 하나의 RUN 안에 넣어줍니다.

```txt
COPY mix.exs mix.lock ./

RUN mix do deps.get, deps.compile
```

의존성 파일을 복사하고, 의존성을 가져와 컴파일합니다.

만약 애셋(assets) 파일이 존재한다면 의존성을 가져온 이후에, 애셋 파일을 빌드합니다. (레이어 캐시를 활용하기 위해)

```txt
COPY assets assets

RUN npm ... && \
    mix phx.digest
```

`mix phx.digest`는 정적 파일을 압축하는 명령입니다.

참고: [Phoenix - mix phx.digest](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Digest.html)

```txt
COPY . .

RUN mix do compile, release
```

나머지 파일을 복사하고 컴파일 후 릴리즈를 생성합니다.

여기서 바로 bin/app start를 해도 되지만, Mutli-stage 빌드를 이용하면 더 **작은 용량**으로 Dockerfile을 최적화할 수 있습니다.

참고: [Docker Multi-stage build](https://docs.docker.com/develop/develop-images/multistage-build/)

```txt
FROM alpine:3.14

WORKDIR /usr/local
```

이후, 필요한 라이브러리를 설치하고 **서울 시간대**로 설정합니다.

참고: [Debian과 Ubuntu에서 Locale과 Timezone 설정하기](https://int-i.github.io/linux/2021-08-15/linux-locale-timezone/)

```txt
RUN apk add --no-cache ncurses-libs tzdata
ENV TZ Asia/Seoul
```

`ncurses-libs`는 릴리즈 앱 실행에 필요한 `libncursesw.so`를 사용하기 위해 설치합니다.

```txt
COPY --from=build /usr/src/app_name/_build/prod/rel/app_name .

EXPOSE 3000
CMD ["bin/app_name", "start"]
```

`COPY`로 빌드 이미지에서 빌드한 **릴리즈 앱**을 가져옵니다.

`EXPOSE`에는 피닉스 앱에서 사용하는 **포트**를 작성합니다.

마지막으로 `CMD`를 이용해 **엘릭서 앱을 실행**합니다.

지금까지의 코드를 정리하면 아래와 같습니다.

`Dockerfile`:

```txt
# syntax=docker/dockerfile:1
FROM elixir:alpine AS build

WORKDIR /usr/src/app_name

ENV MIX_ENV prod

RUN mix do local.hex --force, local.rebar --force

COPY mix.exs mix.lock ./

RUN mix do deps.get, deps.compile

COPY . .

RUN mix do compile, release

FROM alpine:3.14

WORKDIR /usr/local

RUN apk add --no-cache ncurses-libs tzdata
ENV TZ Asia/Seoul

COPY --from=build /usr/src/app_name/_build/prod/rel/app_name .

EXPOSE 3000
CMD ["bin/app_name", "start"]
```

참고: [Phoenix - Deploying with Releases](https://hexdocs.pm/phoenix/releases.html)
