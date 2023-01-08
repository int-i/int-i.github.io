---
title: "GitHub 저장소의 Languages가 잘못 표기되었을 때"
date: 2023-01-08
author: Astro36
category: github
tags: [github, linguist, language, library, vendored, gitattributes]
thumbnail: /assets/posts/2023-01-08-github-linguist/thumbnail.jpg
---

GitHub 저장소에 **라이브러리** 헤더 파일, CSS 등을 포함해서 올리면 아래와 같이 **Languages 표시**가 라이브러리 코드로 인해 이상하게 출력되는 경우가 있다.

![language](/assets/posts/2023-01-08-github-linguist/language.png)

> `api/include/**.h` 라이브러리 헤더 파일로 인해 **C언어** 프로젝트로 인식

`.gitattributes`를 수정하면 **프로젝트 언어**를 **잘못 인식**하는 문제를 해결할 수 있다.

GitHub는 [Linguist 라이브러리](https://github.com/github/linguist)를 이용해 **프로젝트 언어**를 인식하는데, Linguist 설정으로 프로젝트에서 **라이브러리 코드를 제외**할 수 있다.

참고: [About repository languages](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-repository-languages)

방법은 간단하다.

`.gitattributes` 파일을 만들고, **제외할 폴더 경로**와 `linguist-vendored`를 쓰면 된다.

`linguist-vendored`는 라이브러리 등 외부 파일의 경로를 의미한다.

만약, 빌드나 문서화 출력물로 인해 프로젝트 언어가 잘못 표시되는 경우라면, `linguist-vendored` 대신에 `linguist-generated`와 `linguist-documentation`를 사용하는 것을 권장한다.

Linguist는 **기본적으로** [vendor.yml](https://github.com/github/linguist/blob/master/lib/linguist/vendor.yml)는 프로젝트 언어 인식에서 **제외**한다.

`.gitattributes`:

```txt
api/include/** linguist-vendored
```

> `api/include/**.h` 라이브러리 헤더 파일이 **프로젝트 언어 인식에서 제외**된다.

![language-fixed](/assets/posts/2023-01-08-github-linguist/language-fixed.png)

> **C++** 프로젝트로 올바르게 인식됨

