---
title: "RSS 2.0으로 검색이 잘되는 Jekyll 블로그 만들기"
date: 2022-04-09
author: Astro36
category: web
tags: [web, seo, rss, jekyll, feed, atom]
thumbnail: /assets/posts/2022-04-09-rss-jekyll-blog-seo/thumbnail.jpg
---

RSS(Rich Site Summary)는 **뉴스나 블로그**에서 사이트 정보를 **외부**로 전달하기 위해 주로 사용하는 콘텐츠 표현 방식으로, **XML 형태**로 표현되어 콘텐츠 **자동수집에 편리**하도록 구성되어 있습니다.

**GitHub Pages에서 제공**하는 Jekyll를 사용하는 경우, `jekyll-feed` **플러그인**을 이용하면 쉽게 RSS Feed를 구성할 수 있습니다.

참고: [Jekyll 블로그 검색엔진 최적화](https://int-i.github.io/web/2020-03-28/jeykyll-seo/)

하지만, [네이버 서치어드바이저](https://searchadvisor.naver.com/)와 같이 **Atom 형태의 RSS 피드**를 지원하지 않는 경우, 구 버전인 **RSS 2.0** 형식으로 RSS 피드를 만들어야 합니다.

아래 코드는 플러그인을 이용하지 않고 **RSS 2.0 피드**를 생성하는 코드입니다.

`rss.xml`:

```xml
---
---
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{ site.title | xml_escape }}</title>
    <description>{{ site.description | xml_escape }}</description>
    <link>{{ site.url | absolute_url }}</link>
    <atom:link href="{{ "/rss.xml" | absolute_url }}" rel="self" type="application/rss+xml" />
    <language>ko-KR</language>
    <copyright>Copyright 인하대학교 인트아이, All rights reserved.</copyright>
    <pubDate>{{ site.time | date_to_rfc822 }}</pubDate>
    <lastBuildDate>{{ site.time | date_to_rfc822 }}</lastBuildDate>
    <generator>Jekyll</generator>
    {% for post in site.posts limit:30 %}
    <item>
      <title>{{ post.title | xml_escape }}</title>
      <link>{{ post.url | absolute_url }}</link>
      <description>{{ post.content | strip_html | truncatewords: 200 | xml_escape }}</description>
      <author>{{ post.author_email | xml_escape }} ({{ post.author_name | xml_escape }})</author>
      {% for category in post.categories %}
      <category>{{ category | xml_escape }}</category>
      {% endfor %}
      <pubDate>{{ post.date | date_to_rfc822 }}</pubDate>
      <guid>{{ post.url | absolute_url }}</guid>
    </item>
    {% endfor %}
  </channel>
</rss>
```

`<copyright>`, `<author>` 태그를 본인 **블로그에서 사용하는 형식에 맞춰 수정**해서 적용하면 RSS 2.0 피드가 생성됩니다.

![Naver SearchAdvisor Screenshot](/assets/posts/2022-04-09-rss-jekyll-blog-seo/searchadvisor.jpg)

그 후, RSS 피드를 **네이버 서치어드바이저에 적용**하면 잘 되는 것을 확인할 수 있습니다.
