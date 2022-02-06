---
title: "코드 커버리지? 자~ 드가자~! grcov와 Rust 코드 커버리지 측정"
date: 2022-02-06
author: Astro36
category: rust
tags: [rust, nightly, code_coverage, grcov, lcov, codecov, llvm]
thumbnail: /assets/posts/2022-01-23-rust-error-anyhow/thumbnail.jpg
---

[grcov](https://github.com/mozilla/grcov)는 Mozilla 재단에서 FireFox의 코드 검사를 위해 만든 **코드 커버리지 도구**로, `.gcda`, `.profraw` 파일을 분석해 **코드 커버리지 보고서**를 만드는 데에 사용합니다.

`lcov`, `coveralls`, `cobertura`, `html` 등 다양한 **출력 형식**을 지원하며, [CodeCov](https://about.codecov.io/), [Coveralls](https://coveralls.io/) 등의 코드 커버리지 서비스에 **측정 결과를 업로드**해서 온라인으로 보고서를 **공유**할 수도 있습니다.

코드 커버리지가 무엇인지 대해서는 아래 글을 참고해주세요.

참고: [CodeCov 100%? 그만큼 확실하시다는 거지: Codecov를 이용한 C++ 코드 커버리지 측정 방법](https://int-i.github.io/cpp/2021-08-14/cpp-codecov/)

grcov는 테스트 코드 컴파일 과정에서 **`-Z` 플래그**를 사용하기 때문에 **Nightly 빌드**에서만 작동합니다.

```txt
$ rustup toolchain install nightly
```

Nightly 빌드를 **기본 툴체인(Toolchain)으로 지정**합니다.

```txt
$ rustup default nightly
```

> 툴체인(Toolchain)은 소프트웨어를 만드는 데 사용되는 **프로그램 개발 도구**들을 부르는 단어입니다.

이제 `cargo install`을 이용해 grcov를 **설치**합니다.

```txt
$ cargo install grcov
```

커버리지 보고서 생성에 필요한 **의존성**을 설치합니다.

```txt
$ rustup component add llvm-tools-preview
```

커버리지를 측정할 코드의 **테스트를 실행**합니다.

```txt
$ LLVM_PROFILE_FILE="grcov-%p-%m.profraw" RUSTFLAGS="-Zinstrument-coverage" cargo test
```

테스트가 끝나면 **`.profraw` 파일**이 생성된 것을 확인할 수 있습니다.

생성된 `.profraw` 파일을 이용해 **커버리지 보고서**를 만들어 봅시다.

```txt
$ grcov --ignore-not-existing --binary-path ./target/debug/ -o lcov.info -s . .
```

`-o`는 **출력** 파일의 **이름**을 지정하는 플래그이며,
`-s`는 **소스** 파일의 **루트 디렉토리**를 지정하는 플래그입니다.

커버리지 보고서에서 **제외**하고 싶은 파일은 `--ignore` 플래그를 이용하면 됩니다.

예를 들어, `examples` 디렉토리를 **제외**하고 싶은 경우 `--ignore "**/examples/**"`를 붙여줍니다.

최종적으로 생성된 보고서(`lcov.info`)는 CodeCov 등의 서비스에 **업로드**해서 결과를 확인할 수 있습니다.

```txt
$ bash <(curl -s https://codecov.io/bash) -f lcov.info
```

## 번외

grcov에는 `-t` 플래그로 **출력 보고서의 형식**을 지정할 수 있습니다.

로컬에서 커버리지 **결과를 확인**하고 싶은 경우, **HTML 형식**으로 보고서를 출력하면 됩니다.

```txt
$ grcov --ignore-not-existing --binary-path ./target/debug/ -t html -s . .
```

이 밖에도, `coveralls`, `ade`와 같은 다양한 **출력 형식**을 지원하니 홈페이지를 참고해 적용해보세요.

참고: [man grcov](https://github.com/mozilla/grcov#man-grcov)
