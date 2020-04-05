---
title: "Jekyll로 나만의 블로그 만들기"
date: 2020-03-10
author: Astro36
category: web
tags: [github, jekyll, html]
---

[Jekyll](https://jekyllrb.com/)은 정적 사이트(static site) 생성기로 주로 블로그 제작에 이용됩니다.

GitHub Pages는 Jekyll로 웹페이지를 생성하는 기능을 제공하기 때문에 이를 이용하면 쉽게 개인 블로그를 제작할 수 있습니다.

다만, GitHub Pages에서 제공되는 Jekyll은 외부 플러그인을 임의로 설치할 수 없기 때문에 [GitHub Pages Dependencies](https://pages.github.com/versions/)을 확인해 본인이 사용할 플러그인이 지원되는지 확인합니다.

참고: [About GitHub Pages and Jekyll](https://help.github.com/en/github/working-with-github-pages/about-github-pages-and-jekyll)

## 설치 및 실행

아래 설치 방법은 Windows 10을 기준으로 작성되었습니다.

1. Ruby 설치: [RubyInstaller](https://rubyinstaller.org/) (`ruby -v`으로 설치 확인)
2. Jekyll 설치: `gem install jekyll bundler`
3. 블로그 생성: `jekyll new PATH --blank`
4. 블로그 실행: `jekyll serve` 또는 `jekyll s` (초안을 포함시키려면 `--drafts` 옵션 추가)
5. `http://localhost:4000`으로 접속

## 제작

[Minima 테마](https://github.com/jekyll/minima)를 참고해 제작했습니다.

### _config.yml

먼저, `title`, `description`, `url`, `timezone`, `permalink`를 입력합니다.

`jekyll-feed` 플러그인을 넣고 `author` 정보를 입력해줍니다. `jekyll-feed`는 자동으로 `author` 정보를 가져와 `feed.xml`을 생성합니다.

```yml
author:
  name: 인하대학교 인트아이
  email: int-i@example.com
  tel: 010-1234-5678

feed:
  path: atom.xml # 이름 바꾸기
```

`_data/authors.yml`를 추가해 게시글마다의 작성자 정보가 RSS에 자동으로 입력될 수 있게 합니다.

```yml
Test1:
  name: 테스트1
  email: test1@example.com

Test2:
  name: 테스트2
  email: test2@example.com
```

참고: [Jekyll Feed plugin](https://github.com/jekyll/jekyll-feed)

GitHub Pages에는 추가되어있지만, 로컬에서 Jekyll을 생성할 때에는 `jekyll-paginate`을 `plugins`에 추가해야합니다. 그 후 아래와 같이 `paginate` 정보를 입력합니다.

```yml
paginate: 5
paginate_path: "/page/:num/"
```

참고: [Jekyll Pagination](https://jekyllrb.com/docs/pagination/)

마지막으로 SASS 파일이 압축되어 생성되게끔 설정해줍니다.

```yml
sass:
  style: compressed
```

### assets

`assets/css/main.scss`를 열어 아래와 같이 `_sass`에서 코드를 불러오게 합니다.
`---`은 Jekyll이 컴파일할 파일을 인식하게 하므로 삭제하면 안됩니다.

```scss
---
# this ensures Jekyll reads the file to be transformed into CSS later
# only Main files contain this front matter, not partials.
---

@import 'main';
```

이후 `_sass/main.scss`에 원하는 스타일을 넣어 수정하면 됩니다.

> CSS 파일의 확장자를 `.scss`으로 변환해서 `@import`하는 것만으로 Jekyll이 파일을 압축하게 합니다.

### html

Jekyll이 생성하는 HTML 파일은 불필요한 공백이 너무 많이 발생합니다.

`{% raw %}{{- variable -}}{% endraw %}`과 `{% raw %}{%- flow -%}{% endraw %}`으로 [Liquid 템플릿](https://shopify.github.io/liquid/)에서 생성되는 공백을 어느정도 지울 수 있지만, `-`를 넣어줘야 하는 불편함과 HTML에 직접 입력된 공백은 지울 수 없어 [HTML 압축 템플릿](http://jch.penibelst.de/)을 이용했습니다.

게시글 레이아웃을 자동으로 `_layouts/post.html`을 사용하게 하기 위해 `_config.yml`에 아래를 추가했습니다. 이제 게시글마다 `layout: post`를 입력하지 않아도 됩니다.

```yml
defaults:
  - scope:
      path: ""
      type: posts
    values:
      layout: post
```

코드 하이라이터 `rouge`는 `pygments`와 호환되기 때문에 `pygments`로 검색하면 더 많은 테마를 찾을 수 있습니다.
