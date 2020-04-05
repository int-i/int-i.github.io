---
title: "Service Worker와 Workbox: 웹페이지를 빠르게 만드는 새로운 방법"
date: 2020-03-21
author: Astro36
category: web
tags: [pwa, service_worker, workbox, javascript]
---

> 서비스 워커: 프로그래밍 가능한 네트워크 프록시

서비스 워커(Service Worker)는 브라우저가 백그라운드에서 실행하는 스크립트로, 웹페이지와는 별도의 생명주기를 가지고 따로 동작합니다.

서비스 워커는 태초에 오프라인에서 웹페이지를 사용자에게 보여주기 위해 만들어졌기 때문에, 서비스 워커를 이용하면 브라우저에서 파일을 캐시할 수 있고 리퀘스트를 가로채는 등 프록시 서버와 비슷하게 동작합니다.

이 글에서는 서비스 워커와 [Workbox](https://developers.google.com/web/tools/workbox)를 통해 정적 파일을 캐싱(caching)해 웹페이지를 빠르게 로딩하는 방법을 다루겠습니다.

## 시작

> 서비스 워커는 보안상의 이유로 HTTPS에서만 실행됩니다.

서비스 워커의 동작을 정의할 `sw.js` 파일을 루트 디렉토리에 생성합니다.
예를 들어, `https://int-i.github.io/sw.js`에 파일이 있다면 서비스 워커는 `https://int-i.github.io/**/*`에 해당하는 모든 파일에 대해 적용됩니다.

그 후, HTML에서 직접 불러오는 `main.js` 파일에 아래와 같이 서비스 워커를 등록하는 코드를 추가합니다.

```js
if ('serviceWorker' in navigator) { // 서비스 워커 지원 확인
    window.addEventListener('load', function () { // 브라우저 로드가 완료되면
        navigator.serviceWorker.register('/sw.js'); // 서비스 워커 등록
    });
}
```

다시 `sw.js`로 돌아와 서비스 워커가 정상적으로 등록되고 실행되는지 확인하는 코드를 추가합니다.

```js
console.log('Hello from sw.js');
```

이제 브라우저를 실행해 `main.js`를 불러오는 웹페이지에 접속하면, 서비스 워커가 등록되고 `sw.js`가 실행되는 것을 확인할 수 있습니다.

```text
[sw.js:1] Hello from sw.js
```

## 사용

본격적으로 서비스 워커를 이용해 정적 파일 캐싱을 구현해보겠습니다.

[Workbox](https://developers.google.com/web/tools/workbox)는 서비스 워커를 간결하게 사용하기 위한 라이브러리로 캐싱 등의 동작이 정의되어 있습니다.
아래 코드를 이용해 라이브러리를 동적으로 로드합니다.

```js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');
```

라이브러리를 로드했으면 모듈을 이용해 이미지를 캐싱하는 코드를 작성합니다.

```js
const { cacheableResponse, expiration, routing, strategies } = workbox;
const { ExpirationPlugin } = expiration;
const { registerRoute } = routing;
const { CacheFirst } = strategies;

registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
      }),
    ],
  }),
);
```

> `workbox`는 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)를 이용해 모듈을 바동기적으로 로딩하기 때문에 전역(Global)에 선언해 모듈 로딩을 완료하는 것을 권장합니다.

`registerRoute`는 라우터를 등록하는 함수로 [정규식](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)를 만족하는 리소스에 대해 캐싱 전략을 적용합니다.

`CacheFirst`는 리소스를 브라우저 캐시에서 먼저 찾아본 후, 없다면 네트워크를 이용해 파일을 다운로드하는 방식입니다.
이미지 등의 정적 파일은 변경되는 경우가 적고 용량이 크기 때문에 `CacheFirst`로 최대한 캐시를 활용하는 것이 유리합니다.

기타 캐싱 전략 및 자세한 내용을 아래 주소를 참고하시길 바랍니다.

참고: [Workbox Common Recipes](https://developers.google.com/web/tools/workbox/guides/common-recipes)

## 확인

Chrome `개발자 모드(F12) > Network`를 이용해 확인해본 결과 이미지 파일을 서비스 워커 캐시에서 가져옴을 확인할 수 있습니다.

![screenshot](/assets/posts/2020-03-21-serviceworker-workbox/screenshot.png)

파일을 다운로드하지 않고 캐시에서 가져왔기 때문에, 페이지 로딩 속도 개선에도 도움이 됩니다.

아래는 인트아이 홈페이지에 적용된 서비스 워커 파일입니다.

```js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

const { cacheableResponse, core, expiration, googleAnalytics, routing, strategies } = workbox;
const { CacheableResponsePlugin } = cacheableResponse;
const { ExpirationPlugin } = expiration;
const { registerRoute } = routing;
const { CacheFirst, StaleWhileRevalidate } = strategies;

core.clientsClaim();
core.skipWaiting();

// Cache Google Fonts
registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 365 Days
      }),
    ],
  }),
);

// Cache JavaScript and CSS
registerRoute(/\.(?:js|css)$/, new StaleWhileRevalidate());

// Cache Images
registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
      }),
    ],
  }),
);

// Offline Google Analytics
googleAnalytics.initialize();
```
