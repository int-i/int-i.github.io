---
title: "Jekyll 블로그 MathJax 3.0 문법 렌더링"
date: 2020-04-05
author: Astro36
category: web
tags: [github, jekyll, html, kramdown, latex, mathjax, service_worker, workbox, javascript]
---

[MathJax](https://www.mathjax.org/)는 브라우저에서 수학 수식(LaTeX, MathML 등)을 렌더링하는 자바스크립트 엔진으로 2019년 9월 5일 [v3.0.0](http://docs.mathjax.org/en/v3.0-latest/upgrading/whats-new-3.0.html) 업데이트를 통해 [큰 성능 향상](https://www.intmath.com/cg5/katex-mathjax-comparison.php)이 있었다.
그래서 더 빨라진 MathJax 3을 웹페이지 수학 수식 엔진으로 적용해보려 한다.

## 적용

```html
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
```

코드 한 줄이면 적용 가능하다.

참고: [The MathJax Components](http://docs.mathjax.org/en/latest/web/components/index.html)

웹페이지 다운로드 효율성을 위해 **최소한의 컴포넌트**만 사용하고 싶다면 아래와 같이 [startup](http://docs.mathjax.org/en/latest/web/components/misc.html#startup-component) 컴포넌트를 사용하면 된다.

```html
<script>
  window.MathJax = {
    loader: {
      load: ['input/tex-base', 'output/svg']
    },
  };
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/startup.js"></script>
```

이제 브라우저로 코드가 렌더링 되는 것을 확인할 수 있다.

## 호환성 해결

하지만 Jekyll에서는 MathJax 코드를 적용해도 수식이 렌더링 되지 않을 것이다.

그 이유는 Jekyll의 마크다운 엔진 [kramdown](https://kramdown.gettalong.org/)에서는 여전히 **MathJax v2 문법을 기준**으로 수식을 생성하기 때문이다.
문제는 여기서 생긴다.

MathJax API 변경사항 중 MathJax v2 사용하는 `<script type="math/tex">` 표현식을 v3에서는 삭제했다.
따라서 Jekyll 블로그에 MathJax v3 코드를 그대로 적용하면 수식이 제대로 보이지 않는다.

이제 MathJax의 호환성 문제를 해결해보도록 하자.

```js
window.MathJax = {
  options: {
    renderActions: {
      find: [10, function (doc) {
        for (const node of document.querySelectorAll('script[type^="math/tex"]')) {
          const display = !!node.type.match(/; *mode=display/);
          const math = new doc.options.MathItem(node.textContent, doc.inputJax[0], display);
          const text = document.createTextNode('');
          node.parentNode.replaceChild(text, node);
          math.start = { node: text, delim: '', n: 0 };
          math.end = { node: text, delim: '', n: 0 };
          doc.math.push(math);
        }
      }, ''],
    },
  },
};
```

위와 같이 `<script type="math/tex">`을 찾아서 직접 렌더링하면 된다.

> `find`의 첫 번째 요소 `10`은 [`MathItem.STATE.FINDMATH`](https://github.com/mathjax/MathJax-src/blob/master/ts/core/MathItem.ts)의 상숫값이다.

참고: [Changes in the MathJax API](https://docs.mathjax.org/en/latest/upgrading/v2.html#changes-in-the-mathjax-api)

아래는 최종적으로 완성된 코드이다.

```html
<script>
  window.MathJax = {
    loader: {
      load: ['input/tex-base', 'output/svg']
    },
    options: {
      renderActions: {
        findScript: [10, function (doc) {
          for (const node of document.querySelectorAll('script[type^="math/tex"]')) {
            const display = !!node.type.match(/; *mode=display/);
            const math = new doc.options.MathItem(node.textContent, doc.inputJax[0], display);
            const text = document.createTextNode('');
            node.parentNode.replaceChild(text, node);
            math.start = { node: text, delim: '', n: 0 };
            math.end = { node: text, delim: '', n: 0 };
            doc.math.push(math);
          }
        }, '']
      }
    },
  };
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/startup.js"></script>
```

## 서비스 워커 등록

서비스 워커(Service Worker)로 MathJax가 사용하는 컴포넌트와 리소스를 캐싱하면 더 빠르게 웹페이지를 불러올 수 있다.

서비스 워커의 기본 세팅 방법은 [Service Worker와 Workbox: 웹페이지를 빠르게 만드는 새로운 방법](https://int-i.github.io/web/2020-03-21/serviceworker-workbox/)을 참고하자.

필자는 [Workbox](https://developers.google.com/web/tools/workbox)를 이용해 서비스 워커를 구축했다.

Workbox에서는 아래와 같이 [jsDelivr](https://www.jsdelivr.com/) CDN 주소를 등록하면 우선적으로 캐싱된 리소스를 불러와 사용할 수 있다.

```js
// Cache jsDelivr CDN Assets
registerRoute(
  /^https:\/\/cdn\.jsdelivr\.net/,
  new CacheFirst({
    cacheName: 'jsdelivr',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 14, // 14 Days
      }),
    ],
  }),
);
```

리소스가 캐싱되는지 확인하기 위해 Chrome으로 웹페이지에 접속해보자.

![screenshot](/assets/posts/2020-04-05-jekyll-mathjax/screenshot.png)

`개발자 모드(F12) > Network`에서 MathJax 리소스를 서비스 워커에서 가져옴을 확인할 수 있다.
