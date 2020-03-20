# int-i.github.io

> 인하대학교 정보통신공학과 프로그래밍 소모임 인트아이 스터디 블로그

**Do not copy our blog theme without our permission!**

## 설치

단순히 블로그에 글 작성이 목적이라면, Jekyll을 설치하지 않아도 됨

1. Ruby 설치: [RubyInstaller](https://rubyinstaller.org/) (ruby -v으로 설치 확인)
2. Jekyll 설치: `gem install jekyll bundler`
3. 블로그 파일 다운로드: `git clone https://github.com/int-i/int-i.github.io.git`
4. 블로그 실행: `jekyll serve` 또는 `jekyll s` (초안을 포함시키려면 `--drafts` 옵션 추가)
5. `http://localhost:4000`으로 접속

## 저자 등록

`_data/authors.yml` 파일에 아래와 같이 정보 추가

```yml
Astro36: # GitHub 아이디(필수)
  name: 박승재 # 이름(필수)
  email: astro.psj@gmail.com # 이메일
  admission_year: 2019 # 학번(입학년도)
  graduated: false # 졸업여부
```

## 글 작성

`_posts` 디렉토리에 `yyyy-mm-dd-title.md`로 파일 생성 (예: `2020-03-12-post-example.md`)

파일 이름은 영어로 작성해야 하며 공백(` `) 대신 하이픈(`-`) 사용

파일 상단에 [Front Matter](https://jekyllrb.com/docs/front-matter/) 작성

```yml
---
title: "글 작성 예시" # 글 제목
date: 2020-03-12 # 작성일
author: Astro36 # GitHub 아이디 (`_data/authors.yml`에 존재하는 아이디여야 됨)
category: example # 글 카테고리 (띄어쓰기 X, 영어로)
tags: [tag1, tag2, tag3] # 태그 (띄어쓰기 X, 영어로)
---
```

Front Matter 아래에 [Markdown](https://guides.github.com/features/mastering-markdown/)으로 본문 작성

본문에는 `#`(=`<h1>`) 태그는 사용 불가

[2020-01-27-welcome.md](./_posts/2020-01-27-welcome.md) 파일을 참고

최종적으로 사용자 글 URL은 `https://int-i.github.io/category/yyyy-mm-dd/title/` 형태로 생성됨

## 글 이미지 업로드

`assets/posts/`에 `yyyy-mm-dd-title` 디렉토리를 생성 후, 해당 디렉토리에 이미지를 업로드

[2020-01-27-welcome](./assets/posts/2020-01-27-welcome/) 디렉토리 참고

## License

[jekyll-compress-html](http://jch.penibelst.de/) is licensed under a [MIT License](https://github.com/penibelst/jekyll-compress-html/blob/master/LICENSE) by Anatol Broder.

[normalize.css](github.com/necolas/normalize.css) is licensed under a [MIT License](https://github.com/necolas/normalize.css/blob/master/LICENSE.md) by Nicolas Gallagher and Jonathan Neal.
