---
title: "Docker로 Rust 앱 배포 (Feat. cargo-chef)"
date: 2021-10-03
author: Astro36
category: rust
tags: [rust, cargo, chef, docker, debian, alpine]
thumbnail: /assets/posts/2021-10-03-docker-rust/thumbnail.jpg
---

Rust 프로젝트를 Docker로 배포할 때 발생할 수 있는 **문제점**과 **해결방안**을 모아놓은 문서입니다.

기본적인 프로젝트 빌드 `Dockerfile` 생성부터 **빌드 캐시**를 최대한 활용할 수 있게 **레이어를 구성**하는 방법을 소개합니다.

## 시작하기

`Dockerfile`:

```txt
# syntax=docker/dockerfile:1
FROM rust:1.55.0-slim

WORKDIR /usr/src/project

COPY . .
RUN cargo build --release

CMD ["./target/release/project"]
```

**프로젝트를 빌드**하는 `Dockerfile`입니다.

## Mutli-stage 빌드

`Dockerfile`:

```txt
# syntax=docker/dockerfile:1
FROM rust:1.55.0-slim AS builder

WORKDIR /usr/src/project

COPY . .
RUN cargo build --release

FROM debian:bullseye-slim

WORKDIR /usr/local/bin

COPY --from=builder /usr/src/project/target/release/project .

CMD ["./project"]
```

[Mutli-stage 빌드](https://docs.docker.com/develop/develop-images/multistage-build/)를 활용한 `Dockerfile`입니다.

프로젝트 실행에 **불필요한 의존성**이 없기 때문에 **도커 이미지의 크기**를 더 줄일 수 있습니다.

## Mutli-stage 빌드 + 의존성 컴파일

`Dockerfile`:

```txt
# syntax=docker/dockerfile:1
FROM rust:1.55.0-slim AS builder

WORKDIR /usr/src/project

RUN cargo init .
COPY Cargo* ./
RUN cargo build --release && \
    rm target/release/deps/project*

COPY . .
RUN cargo build --release

FROM debian:bullseye-slim

WORKDIR /usr/local/bin

COPY --from=builder /usr/src/project/target/release/project .

CMD ["./project"]
```

Rust는 **컴파일 속도**가 느리기 때문에 최대한 컴파일 분량을 줄이는 것이 중요합니다.

미리 **빈 프로젝트**를 만들고 **의존성만 컴파일**해서 레이어를 따로 만들어 둔다면,

**프로젝트 코드가 수정**되어 빌드 이미지를 다시 생성해야 될 때 의존성은 다시 컴파일하지 않고 **미리 컴파일해둔 레이어를 재사용**할 수 있습니다.

`target/release/deps/project*`를 지우는 이유는 현재 프로젝트 컴파일 캐시만 지워서,

`COPY` 이후 두 번째 `cargo build`에서 **현재 프로젝트만 다시 컴파일** 할 수 있게하기 위함입니다.

## Mutli-stage 빌드 + cargo-chef

`Dockerfile`:

```txt
# syntax=docker/dockerfile:1
FROM rust:1.55.0-slim AS chef

WORKDIR /usr/src/project

RUN set -eux; \
    cargo install cargo-chef; \
    rm -rf $CARGO_HOME/registry

FROM chef as planner

COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder

COPY --from=planner /usr/src/project/recipe.json .
RUN cargo chef cook --release --recipe-path recipe.json

COPY . .
RUN cargo build --release

FROM debian:bullseye-slim

WORKDIR /usr/local/bin

COPY --from=builder /usr/src/project/target/release/project .

CMD ["./project"]
```

[cargo-chef](https://github.com/LukeMathWalker/cargo-chef)는 Rust 프로젝트의 **의존성을 캐시**해서 **도커 빌드 속도를 높일 수 있게** 도와주는 도구입니다.

`cargo install` 명령을 통해 설치할 수 있으며, `cargo chef prepare`와 `cargo chef cook`으로 **의존성을 저장하고 컴파일** 할 수 있습니다.

`recipe.json` 파일은 파이썬의 `requirements.txt` 파일과 같이 **의존성을 기록**해두는 파일로, `cargo chef cook`을 통해 **의존성을 다운로드하여 컴파일**할 수 있습니다.

## Mutli-stage 빌드 + cargo-chef + Alpine Linux

`Dockerfile`:

```txt
# syntax=docker/dockerfile:1
FROM rust:1.55.0-alpine AS chef

WORKDIR /usr/src/project

RUN set -eux; \
    apk add --no-cache musl-dev; \
    cargo install cargo-chef; \
    rm -rf $CARGO_HOME/registry

FROM chef as planner

COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder

COPY --from=planner /usr/src/project/recipe.json .
RUN cargo chef cook --release --recipe-path recipe.json

COPY . .
RUN cargo build --release

FROM alpine:3.14

WORKDIR /usr/local/bin

COPY --from=builder /usr/src/project/target/release/project .

CMD ["./project"]
```

Debian 대신 Alpine Linux를 이용한다면 **이미지 용량**을 더욱 줄일 수 있습니다.

`musl-dev` 패키지는 cargo-chef에서 사용하는 의존성입니다.

참고: [Optimizing Docker Images for Rust Projects](http://whitfin.io/speeding-up-rust-docker-builds/)
