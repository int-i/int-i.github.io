---
title: "GitHub Readme 꾸미기 (Shields.io + SVG 로고)"
date: 2021-09-05
author: Astro36
category: github
tags: [github, badge, markdown, readme, shields.io, logo, image, svg]
thumbnail: /assets/posts/2021-09-05-shields-io-svg-logo/thumbnail.jpg
---

[Shields.io](https://shields.io/)는 GitHub Readme에서 사용할 수 있는 **여러 Badge를 제공**해주는 서비스입니다.

[GitHub Badge 만들기 (shields.io 사용법)](https://2dowon.netlify.app/etc/github-badge/)를 참고하면 Shields.io의 기본적인 사용법을 배울 수 있습니다.

여기서 소개할 내용은 Shields.io에 로고를 넣는 기능입니다.

Shields.io의 이미지 URL에는 `logo=logo_name`로 **로고를 추가**할 수 있습니다.

![Rust](https://img.shields.io/badge/rust-black.svg?logo=rust&logoColor=white&style=for-the-badge)

```md
![Rust](https://img.shields.io/badge/rust-black.svg?logo=rust&logoColor=white&style=for-the-badge)
```

이때 `logo_name`은 [Simple Icons](https://simpleicons.org/) **사이트에 등록된 로고**만 사용이 가능합니다.

하지만 [Data URI](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)를 이용해 Base64로 인코딩된 이미지를 전달하면, 임의의 이미지도 사용할 수 있습니다.

## Practice

Simple Icons 사이트에 존재하지 않는 [Tokio](https://tokio.rs/) 로고를 예시로 사용하겠습니다.

먼저 로고를 Badge에 사용하기 위해선 로고 이미지를 **SVG 파일**로 구해야 합니다.

![Tokio](https://raw.githubusercontent.com/tokio-rs/website/master/public/img/icons/tokio.svg)

[GitHub tokio-rs/website/tokio.svg](https://github.com/tokio-rs/website/blob/master/public/img/icons/tokio.svg)

SVG 파일을 구했다면, Base64로 인코딩 했을 때의 길이를 줄이기 위해 **이미지를 압축**합니다.

SVG 파일의 압축은 [SVGOMG](https://jakearchibald.github.io/svgomg/)를 이용하면 편하게 할 수 있습니다.

압축한 SVG 파일을 **Base64로 인코딩**할 차례입니다.

[Base64 Encode and Decode](https://www.base64encode.org/)에 SVG 파일 텍스트 붙여넣고 출력된 결과를 가져옵니다.

마지막으로 **Data URI 형식으로 이미지를 삽입**합니다.

```txt
https://img.shields.io/badge/tokio-black.svg?logo=data:image/svg+xml;base64,<base64_image>&style=for-the-badge
```

**Markdown으로 이미지를 출력**하면 마무리됩니다.

![Tokio](https://img.shields.io/badge/tokio-black.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTA4Ij48ZyBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yOS44OTMgNjguNzk0bC0xLjY4Ny45NzQgMiAzLjQ2NCAxLjY4Ny0uOTc0IDEyLjIxNC03LjA1MiAxLjY4Ny0uOTc0LTItMy40NjQtMS42ODcuOTc0ek04OC4xMDcgNzIuMjU4bDEuNjg3Ljk3NCAyLTMuNDY0LTEuNjg3LS45NzQtMTIuMjE0LTcuMDUyLTEuNjg3LS45NzQtMiAzLjQ2NCAxLjY4Ny45NzR6Ii8+PHBhdGggZD0iTTgwIDU0YzAtMTEuMDQ2LTguOTU0LTIwLTIwLTIwcy0yMCA4Ljk1NC0yMCAyMCA4Ljk1NCAyMCAyMCAyMCAyMC04Ljk1NCAyMC0yMHptLTM1Ljc2NyAwYzAtOC43MDggNy4wNTktMTUuNzY3IDE1Ljc2Ny0xNS43NjcgOC43MDggMCAxNS43NjcgNy4wNTkgMTUuNzY3IDE1Ljc2NyAwIDguNzA4LTcuMDU5IDE1Ljc2Ny0xNS43NjcgMTUuNzY3LTguNzA4IDAtMTUuNzY3LTcuMDU5LTE1Ljc2Ny0xNS43Njd6Ii8+PGNpcmNsZSBjeD0iMjQiIGN5PSI3NSIgcj0iMyIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iOTYiIHI9IjMiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjEyIiByPSIzIi8+PGNpcmNsZSBjeD0iOTYiIGN5PSIzMyIgcj0iMyIvPjxjaXJjbGUgY3g9IjI0IiBjeT0iMzMiIHI9IjMiLz48Y2lyY2xlIGN4PSI5NiIgY3k9Ijc1IiByPSIzIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI1NCIgcj0iMyIvPjxwYXRoIGQ9Ik0yIDUySDB2NGg0MnYtNGgtMnpNODAgNTJoLTJ2NGg0MnYtNGgtMnpNNzIuODMgNzAuMzg5bC0xLjAwNy0xLjcyOS0zLjQ1NiAyLjAxNCAxLjAwNyAxLjcyOCAxOS4xMjggMzIuODM1IDEuMDA3IDEuNzI4IDMuNDU2LTIuMDE0LTEuMDA3LTEuNzI4ek0zMi41ODEgMi4xNEwzMS41NzUuNDEybC0zLjQ1NyAyLjAxMyAxLjAwNyAxLjcyOSAxOS4xMjggMzIuODM0IDEuMDA3IDEuNzI4IDMuNDU2LTIuMDEzLTEuMDA2LTEuNzI4ek05MC43MSA0LjE1NGwxLjAwNi0xLjcyOUw4OC4yNi40MTIgODcuMjUzIDIuMTQgNjguMTI1IDM0Ljk3NWwtMS4wMDcgMS43MjggMy40NTcgMi4wMTMgMS4wMDYtMS43Mjh6TTUwLjgyNyA3Mi41OTdsMS4wMDYtMS43MjgtMy40NTYtMi4wMTQtMS4wMDcgMS43MjgtMTkuMTI4IDMyLjgzNS0xLjAwNyAxLjcyOCAzLjQ1NyAyLjAxNCAxLjAwNi0xLjcyOHpNNTggODcuMDE3Vjg5aDRWNzFoLTR2MS45ODN6TTU4IDM1LjA1MlYzN2g0VjE5aC00djEuOTQ4ek00Mi4xMDcgNDYuMjU4bDEuNjg3Ljk3NCAyLTMuNDY0LTEuNjg3LS45NzQtMTIuMjE0LTcuMDUyLTEuNjg3LS45NzQtMiAzLjQ2NCAxLjY4Ny45NzR6TTc1Ljg5MyA0Mi43OTRsLTEuNjg3Ljk3NCAyIDMuNDY0IDEuNjg3LS45NzQgMTIuMjE0LTcuMDUyIDEuNjg3LS45NzQtMi0zLjQ2NC0xLjY4Ny45NzR6Ii8+PC9nPjwvc3ZnPg==&style=for-the-badge)

```md
![Tokio](https://img.shields.io/badge/tokio-black.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTA4Ij48ZyBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yOS44OTMgNjguNzk0bC0xLjY4Ny45NzQgMiAzLjQ2NCAxLjY4Ny0uOTc0IDEyLjIxNC03LjA1MiAxLjY4Ny0uOTc0LTItMy40NjQtMS42ODcuOTc0ek04OC4xMDcgNzIuMjU4bDEuNjg3Ljk3NCAyLTMuNDY0LTEuNjg3LS45NzQtMTIuMjE0LTcuMDUyLTEuNjg3LS45NzQtMiAzLjQ2NCAxLjY4Ny45NzR6Ii8+PHBhdGggZD0iTTgwIDU0YzAtMTEuMDQ2LTguOTU0LTIwLTIwLTIwcy0yMCA4Ljk1NC0yMCAyMCA4Ljk1NCAyMCAyMCAyMCAyMC04Ljk1NCAyMC0yMHptLTM1Ljc2NyAwYzAtOC43MDggNy4wNTktMTUuNzY3IDE1Ljc2Ny0xNS43NjcgOC43MDggMCAxNS43NjcgNy4wNTkgMTUuNzY3IDE1Ljc2NyAwIDguNzA4LTcuMDU5IDE1Ljc2Ny0xNS43NjcgMTUuNzY3LTguNzA4IDAtMTUuNzY3LTcuMDU5LTE1Ljc2Ny0xNS43Njd6Ii8+PGNpcmNsZSBjeD0iMjQiIGN5PSI3NSIgcj0iMyIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iOTYiIHI9IjMiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjEyIiByPSIzIi8+PGNpcmNsZSBjeD0iOTYiIGN5PSIzMyIgcj0iMyIvPjxjaXJjbGUgY3g9IjI0IiBjeT0iMzMiIHI9IjMiLz48Y2lyY2xlIGN4PSI5NiIgY3k9Ijc1IiByPSIzIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI1NCIgcj0iMyIvPjxwYXRoIGQ9Ik0yIDUySDB2NGg0MnYtNGgtMnpNODAgNTJoLTJ2NGg0MnYtNGgtMnpNNzIuODMgNzAuMzg5bC0xLjAwNy0xLjcyOS0zLjQ1NiAyLjAxNCAxLjAwNyAxLjcyOCAxOS4xMjggMzIuODM1IDEuMDA3IDEuNzI4IDMuNDU2LTIuMDE0LTEuMDA3LTEuNzI4ek0zMi41ODEgMi4xNEwzMS41NzUuNDEybC0zLjQ1NyAyLjAxMyAxLjAwNyAxLjcyOSAxOS4xMjggMzIuODM0IDEuMDA3IDEuNzI4IDMuNDU2LTIuMDEzLTEuMDA2LTEuNzI4ek05MC43MSA0LjE1NGwxLjAwNi0xLjcyOUw4OC4yNi40MTIgODcuMjUzIDIuMTQgNjguMTI1IDM0Ljk3NWwtMS4wMDcgMS43MjggMy40NTcgMi4wMTMgMS4wMDYtMS43Mjh6TTUwLjgyNyA3Mi41OTdsMS4wMDYtMS43MjgtMy40NTYtMi4wMTQtMS4wMDcgMS43MjgtMTkuMTI4IDMyLjgzNS0xLjAwNyAxLjcyOCAzLjQ1NyAyLjAxNCAxLjAwNi0xLjcyOHpNNTggODcuMDE3Vjg5aDRWNzFoLTR2MS45ODN6TTU4IDM1LjA1MlYzN2g0VjE5aC00djEuOTQ4ek00Mi4xMDcgNDYuMjU4bDEuNjg3Ljk3NCAyLTMuNDY0LTEuNjg3LS45NzQtMTIuMjE0LTcuMDUyLTEuNjg3LS45NzQtMiAzLjQ2NCAxLjY4Ny45NzR6TTc1Ljg5MyA0Mi43OTRsLTEuNjg3Ljk3NCAyIDMuNDY0IDEuNjg3LS45NzQgMTIuMjE0LTcuMDUyIDEuNjg3LS45NzQtMi0zLjQ2NC0xLjY4Ny45NzR6Ii8+PC9nPjwvc3ZnPg==&style=for-the-badge)
```

## Error: URI Too Long

Data URI를 포함한 이미지 URL이 너무 길면, `Error: URI Too Long`를 출력하며 이미지가 보여지지 않습니다.

이럴때는 [is.am](http://is.am/)과 같은 **URL 단축 서비스**를 이용하면 정상적으로 출력됩니다.

![HAProxy](http://is.am/4jur)

```md
![HAProxy](http://is.am/4jur)
```
