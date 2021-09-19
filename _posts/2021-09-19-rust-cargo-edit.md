---
title: "Rust 개발 필수 유틸: cargo edit"
date: 2021-09-19
author: Astro36
category: rust
tags: [rust, crate, cargo, edit]
thumbnail: /assets/posts/2021-09-19-rust-cargo-edit/thumbnail.jpg
---

Rust의 [Cargo](https://doc.rust-lang.org/cargo/)는 Node.js의 [npm](https://www.npmjs.com/)이나 Python의 [pip](https://pip.pypa.io/en/stable/)와 같은 패키지 매니저와는 다르게 명령어를 통해 라이브러리를 설치하는 방식이 아닌, 사용자가 직접 `Cargo.toml` **파일을 열어서 라이브러리 정보를 작성**해줘야 하는 방식입니다.

위의 귀찮음으로 인해, [cargo edit](https://github.com/killercup/cargo-edit)이 나오게 되었습니다.

cargo edit을 설치하면 `npm install`과 같은 **라이브러리 설치 명령**을 `cargo add`을 이용해 할 수 있습니다.

예를 들어, [`serde`](https://crates.io/crates/serde) 패키지를 설치하기 위해서는,

`Cargo.toml` 파일을 열어 [crates.io](https://crates.io/)의 라이브러리 **정보를 작성**해줘야 합니다.

`Cargo.toml`:

```toml
[dependencies]
serde = "1.0.130"
```

하지만, cargo edit을 이용하면 명령어를 통해 이 작업을 **대체**할 수 있습니다.

```txt
$ cargo add serde
```

## 설치

`cargo install`을 이용해 설치할 수 있습니다.

> 주의: `cargo install`은 하나의 컴파일 된 **프로그램을 설치**하는 명령입니다.
> 현재 Cargo는 라이브러리를 설치하는 명령을 **지원하지 않습니다.**

```txt
$ cargo install cargo-edit
```

> cargo edit을 설치하기 위해서는 `libssl-dev`와 `pkg-config`가 필요합니다.
>
> ```txt
> sudo apt install libssl-dev pkg-config
> ```

## 사용 방법

`cargo add package_name`을 이용해 패키지를 설치할 수 있습니다.

패키지의 **`feature`를 입력**하기 위해서는 `--features`를 이용하면 됩니다.

```txt
$ cargo add tokio --features full
```

`Cargo.toml`:

```toml
[dependencies]
tokio = { version = "1.11.0", features = ["full"] }
```

**특정 버전**의 패키지를 설치하기 위해서는 패키지 이름 뒤에 `@version`을 붙여줍니다.

```txt
$ cargo add rocket@0.5.0-rc.1
```

`Cargo.toml`:

```toml
[dependencies]
rocket = "0.5.0-rc.1"
```

패키지를 **최신 버전**으로 바꾸기 위해서는 `cargo upgrade`를 사용할 수 있습니다.

```txt
$ cargo upgrade
```

> `cargo update`는 `Cargo.lock`을 **업데이트**하는 명령으로 전혀 다른 명령입니다.

패키지를 **삭제**할 때는 `cargo rm`을 이용합니다.

```txt
$ cargo rm regex
```

마지막으로 **현재 프로젝트의 버전을 수정**할 때는 `cargo set-version`을 이용할 수 있습니다.

```txt
$ cargo set-version 1.0.0
$ cargo set-version --bump major
$ cargo set-version --bump minor
$ cargo set-version --bump patch
```

참고: [GitHub - cargo edit](https://github.com/killercup/cargo-edit)

참고: [[Rust] 필수 유틸: cargo-edit](https://m.blog.naver.com/sssang97/222093385552)

