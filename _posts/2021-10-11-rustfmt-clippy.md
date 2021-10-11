---
title: "rustfmt와 Clippy: 강조되고 반복되는 코드는 유지보수를 불안하게 해요"
date: 2021-10-11
author: Astro36
category: rust
tags: [rust, cargo, formatter, linter, rustfmt, clippy]
thumbnail: /assets/posts/2021-10-11-rustfmt-clippy/thumbnail.jpg
---

[rustfmt](https://github.com/rust-lang/rustfmt)와 [Clippy](https://github.com/rust-lang/rust-clippy)는 보다 나은 Rust 코드를 작성하기 위한 **코드 포맷터**(Formatter)와 **린터**(Linter)입니다.

두 가지 도구를 사용하는 이유는 포맷터와 린터는 비슷해 보이지만 사용 목적이 다르기 때문입니다.

코드 포맷터란 들여쓰기 등 **코드 스타일 교정**을 위한 도구이고, 코드 린터는 **읽기 나쁜 코드를 수정**하기 위한 도구입니다.

코드 포맷터와 린터의 자세한 차이는 아래 글을 참고해주세요.

참고: [prettier와 eslint를 구분해서 사용하자](https://velog.io/@yrnana/prettier%EC%99%80-eslint%EB%A5%BC-%EA%B5%AC%EB%B6%84%ED%95%B4%EC%84%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EC%9E%90)

## rustfmt

rustfmt는 Rust 팀에서 개발하고 관리하는 **공식 코드 포맷터**입니다.

rustfmt를 이용하면 **공식 스타일 가이드라인**을 참고해서 자동으로 코드 스타일을 수정할 수 있습니다.

rustfmt는 cargo를 통해 설치할 수 있습니다:

```txt
$ rustup component add rustfmt
```

코드 포맷팅 명령입니다:

```txt
$ cargo fmt
```

코드 포맷팅 과정은 **빌드가 필요하지 않기** 때문에 빠르게 동작합니다.

하지만, 매크로 등의 문법을 파싱하지 않기 때문에 **일부 코드는 읽지 않고 스킵**합니다.

Github Actions 등의 CI에서는 `--check` 옵션을 달아 **성공 여부**를 판단합니다.

`--check`는 교정할 코드가 없으면 0을 반환하고, 교정할 코드가 있으면 1을 반환합니다.

`.github/workflows/rust.yml`:

```yml
- name: Format sources
  run: cargo fmt --all -- --check
```

## Clippy

Clippy 또한 Rust 팀에서 개발/관리 하는 **코드 린터**입니다.

마찬가지로, cargo를 이용해 설치할 수 있습니다:

```txt
$ rustup component add clippy
```

`cargo clippy`로 **현재 코드의 문제점**을 파악할 수 있고, `--fix` 옵션을 이용해 문제를 **자동으로 수정**할 수 있습니다.

```txt
$ cargo clippy --fix
```

린트 수준(Lint Level)은 Allow/Warn/Deny로 나뉩니다.

Allow는 별도의 메세지를 출력하지 않으며, Warn은 경고 메세지 출력, Deny는 경고 메세지와 빌드 실패를 출력합니다.

일반적으로 CI에서는 Warn과 Deny까지만 코드를 교정합니다.

여기서 Warn에도 빌드 실패를 만들어 CI에서 감지하지 위해 `-D warnings` 옵션을 줍니다.

> `D`는 Deny의 앞글자입니다

`.github/workflows/rust.yml`:

```yml
- name: Lint sources
  run: cargo clippy -- -D warnings
```

**일부 규칙만 예외**로 설정하기 위해서는 `-A` 옵션을 사용합니다.

```txt
$ cargo clippy -- -A clippy::lint_name
```

`lint_name`은 [Clippy Lints](https://rust-lang.github.io/rust-clippy/master/index.html)에서 확인할 수 있습니다.

프로젝트가 아닌 **함수/모듈 단위**로 예외를 허용하고 싶을 때는 `#[allow(...)]` 속성(Attribute)를 이용합니다.

## Badge

[Shields.io](https://shields.io/)를 이용하면 Github Actions의 성공 여부를 **Badge**로 나타낼 수 있습니다.

```md
![GitHub Workflow](https://img.shields.io/github/workflow/status/user/repo/action?logo=github&logoColor=white&style=for-the-badge)
```

Github Actions 이외의 [Travis CI](https://travis-ci.org/) 등 다른 CI도 지원하니 참고하면 좋을 것 같습니다.
