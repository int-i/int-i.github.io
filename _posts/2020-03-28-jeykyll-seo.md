---
title: "Jekyll 블로그 검색엔진 최적화"
date: 2020-03-28
author: Astro36
category: web
tags: [github, jekyll, html, meta, feed, sitemap, seo]
---

검색엔진 최적화(SEO; Search Engine Optimization)는 말 그대로 사이트를 구글, 네이버와 같은 검색엔진에서 검색이 더 잘되게 하는 것을 말합니다.
Jekyll과 GitHub Pages로 블로그를 만들면 개발자가 직접 검색엔진에 등록해야 검색엔진이 사이트를 보여줄 수 있습니다.
이 글에서는 Jekyll로 만든 블로그를 검색엔진에 등록하고 검색엔진 최적화를 하는 방법을 소개합니다.
Jekyll로 블로그 자체를 만드는 방법에 대해서는 [Jekyll로 나만의 블로그 만들기](https://int-i.github.io/web/2020-03-10/build-blog-with-jekyll/)를 참고하세요.

## HTML

`<title>` 태그는 독자와 검색엔진에 특정 페이지의 주제가 무엇인지 알려줍니다.
`<title>` 태그는 HTML의 `<head>` 요소 안 쪽에 위치해야 하며 페이지마다 고유한 제목을 만들어야 합니다.

```html
{% if page.title %}
  {% capture title %}{% raw %}{{ page.title }}{% endraw %} - {% raw %}{{ site.title }}{% endraw %}{% endcapture %}
{% else %}
  {% capture title %}{% raw %}{{ site.title }}{% endraw %}{% endcapture %}
{% endif %}
<title>{% raw %}{{ title }}{% endraw %}</title>
```

`<description>` 태그는 검색엔진에 페이지 내용을 요약하여 제공합니다.
`<description>` 태그는 `<title>` 태그와 마찬가지로 HTML의 `<head>` 요소 안 쪽에 위치해야 합니다.

```html
{% if page.excerpt %}
  {% capture description %}{% raw %}{{ page.excerpt | strip_html | truncate: 100 }}{% endraw %}{% endcapture %}
{% else %}
  {% capture description %}{% raw %}{{ site.description }}{% endraw %}{% endcapture %}
{% endif %}
<meta name="description" content="{% raw %}{{ description }}{% endraw %}">
```

`<title>`와 `<description>` 태그는 구글 Search Console에서 필수적으로 설정하길 권장하는 태그입니다.

참고: [검색엔진 최적화(SEO) 초보자 가이드](https://support.google.com/webmasters/answer/7451184)

그 다음은 [OG 태그](https://ogp.me/)를 설정해야 합니다.
OG 태그는 페이스북에서 만든 개념으로 웹 페이지에 대한 간단한 정보를 제공하며 검색엔진이나 앱에서 페이지 내용 미리보기 등을 표시하는데 사용합니다.

<figure>
  <img src="/assets/posts/2020-03-28-jeykyll-seo/ogtag_example.jpg" alt="OGTag Example" style="max-width: 256px;">
  <figcaption>카카오톡에서는 OG태그를 이용해 웹 페이지 정보를 보여줍니다</figcaption>
</figure>

```html
<meta property="og:type" content="website">
<meta property="og:url" content="{% raw %}{{ page.url | absolute_url }}{% endraw %}">
<meta property="og:title" content="{% raw %}{{ title }}{% endraw %}">
<meta property="og:description" content="{% raw %}{{ description }}{% endraw %}">

<!-- 미리보기 사진 -->
<meta property="og:image" content="{% raw %}{{ "/assets/img/icon512.png" | relative_url }}{% endraw %}">
```

OG 태그는 페이스북, 네이버 블로그, 카카오톡 등 다양한 플랫폼에서 인식합니다.
한편, 트위터에서는 OG태그의 정보를 더할 자체적인 메타 데이터 표기법도 가지고 있습니다.

[트위터 카드](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/abouts-cards)라고 불리는 이 태그는 트위터 내에서 웹 사이트 정보를 표시하는데 사용됩니다.
트위터 카드 종류 중 [Summary Card](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/summary-card-with-large-image)는 제목, 요약, 이미지(썸네일)를 보여줄 수 있는 태그로 아래와 같이 사용합니다.

```html
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{% raw %}{{ title }}{% endraw %}">
<meta name="twitter:description" content="{% raw %}{{ description }}{% endraw %}">

<!-- 미리보기 사진 -->
<meta name="twitter:image" content="{% raw %}{{ "/assets/img/icon512.png" | relative_url }}{% endraw %}">
```

트위터 카드 태그는 트위터 내에서 OG 태그보다 우선순위가 높으며, 트위터 카드가 없으면 OG 태그를 이용해 정보를 구성합니다.

캐노니컬 태그는 중복되거나 유사한 태그를 하나의 태그로 통합하는 태그입니다.
예를 들어 아래는 모두 같은 페이지를 가리키지만 형태가 다른 주소입니다.

- [https://int-i.github.io](https://int-i.github.io)
- [https://int-i.github.io/](https://int-i.github.io/)
- [https://int-i.github.io/#top](https://int-i.github.io/#top)

검색엔진이 위 페이지를 서로 다른 페이지라고 오해하는 것을 막기 위해 캐노니컬 태그로 검색엔진에 페이지의 기본 주소를 알려줘야 합니다.

```html
<link rel="canonical" href="https://int-i.github.io/">
```

인트아이 블로그에서는 위 태그 이외에도 검색엔진에 추가적인 정보를 주기 위해 아래 태그를 사용합니다.

```html
<!-- 페이지가 UTF-8 인코딩을 사용함 -->
<meta charset="UTF-8">

<!-- IE 호환성 보기 모드 활성화 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<!-- 웹 페이지 이름 -->
<meta name="application-name" content="{% raw %}{{ site.title }}{% endraw %}">

<!-- 웹 페이지 제작자(저자) -->
<meta name="author" content="{% raw %}{{ site.author.name }}{% endraw %}">

<!-- 웹 페이지 엔진 -->
<meta name="generator" content="Jekyll v3.8.5">

<!-- 웹 페이지 키워드 -->
<meta name="keywords" content="{% raw %}{{ keywords }}{% endraw %}">

<!-- 모바일 화면 최적화 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

참고: [<meta>: The Document-level Metadata element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)

## Atom

RSS는 Rich Site Summary의 약자로 사이트의 정보를 외부로 전달하기 위한 기술입니다.
아톰(Atom) 피드는 RSS를 확장한 개념으로 Jekyll에서는 [jekyll-feed](https://github.com/jekyll/jekyll-feed) 플러그인을 이용해 쉽게 아톰 피드를 생성할 수 있습니다.

먼저, `_config.yml`에 `jekyll-feed` 플러그인를 추가합니다.

```yml
plugins:
  - jekyll-feed
```

그 다음, `_config.yml`에 `author` 정보를 등록합니다.

```yml
author:
  name: 인하대학교 인트아이
```

아래와 같이 생성되는 피드 파일 이름을 바꿀 수 있습니다.

```yml
feed:
  path: atom.xml
```

이제 [https://int-i.github.io/atom.xml](https://int-i.github.io/atom.xml)에 접속하면 아톰 피드가 정상적으로 생성되는 것을 확인할 수 있습니다.

## Sitemap

[사이트맵](https://www.sitemaps.org/ko/protocol.html)은 사이트에 있는 페이지, 동영상 및 기타 파일과 각 관계에 관한 정보를 제공하는 파일입니다.
검색엔진은 사이트맵을 읽고 사이트를 더 지능적으로 크롤링하게 됩니다.

Jekyll에서는 [jekyll-sitemap](https://github.com/jekyll/jekyll-sitemap) 플러그인을 이용해 자동으로 사이트맵을 생성할 수 있습니다.

```yml
plugins:
  - jekyll-sitemap
```

[https://int-i.github.io/sitemap.xml](https://int-i.github.io/sitemap.xml)에 사이트맵이 만들어지는 것을 볼 수 있습니다.

> 만약 사이트맵이 안보인다면 `baseurl`을 확인해보세요.
> `baseurl`이 `/`([기본값](https://ben.balter.com/jekyll-style-guide/config/#baseurl))으로 설정되어 있다면, [https://int-i.github.io//sitemap.xml](https://int-i.github.io//sitemap.xml)에 사이트맵이 생성됩니다.
> `baseurl`을 `""`으로 바꿔주세요.
>
> 참고: [sitemap에 /가 중복되는 생기는 이슈](https://github.com/jekyll/jekyll-sitemap/issues/182)

## Search Console

[구글 Search Console](https://search.google.com/search-console)에서 `속성 추가>URL 접두어`에 사이트 주소를 입력해 사이트를 등록합니다.

![Google Search Console](/assets/posts/2020-03-28-jeykyll-seo/search_console.png)

그리고 `Sitemaps` 탭으로 가, 위에서 만든 사이트맵을 제출합니다.

![Google Search Console Sitemap](/assets/posts/2020-03-28-jeykyll-seo/search_console_sitemap.png)

등록이 완료되면 구글 검색창에 `site:int-i.github.io`를 검색해 구글이 내 사이트의 존재를 알고 있는지 확인합니다.

![Search Google](/assets/posts/2020-03-28-jeykyll-seo/search_google.png)

자신의 사이트가 검색 결과에 포함되어 있다면 구글 검색 DB에 내 사이트가 등록된 것입니다.

참고: [구글 검색에 내 사이트 등록하는 방법](https://pcwpower.tistory.com/26)
