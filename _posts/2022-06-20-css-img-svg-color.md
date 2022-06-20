---
title: "야, SVG도 CSS로 <img> 색상 바꿀 수 있어 (Feat. filter)"
date: 2022-06-20
author: Astro36
category: web
tags: [web, css, svg, img, filter, color]
thumbnail: /assets/posts/2022-06-20-css-img-svg-color/thumbnail.jpg
---

```html
<img class="icon" src="icon.svg" alt="icon">
```

SVG 이미지를 **아이콘 버튼** 등으로 사용한다면 `:hover`와 같이 마우스 포인터의 위치에 따라 **이미지의 색상**을 바꿔야 하는 경우가 있습니다.

구글의 [Material Icons](https://fonts.google.com/icons) 등을 이용해 **폰트로 아이콘**을 표현하는 경우는 `color` 속성을 변경해서 아이콘 색상을 바꾸겠지만,

`<img>` 태그를 사용해 아이콘을 표현하는 경우 `color`를 이용해 **색상을 바꿀 수 없습니다.**

아예 `icon_black.svg`, `icon_white.svg`와 같이 **색이 다른 아이콘**을 미리 준비하고 **자바스크립트**를 이용해 `img`의 `src` 속성을 **교체**해 색상이 바뀌는 연출을 할 수도 있지만,

똑같은 형태의 아이콘을 여러 개 준비하고 웹 브라우저에서 색상별로 아이콘을 다운로드 받는 것을 고려해보면 **비효율적**으로 보입니다.

CSS의 `filter`를 이용하면 아이콘의 색상이 바뀌는 것을 **비슷하게 구현**할 수 있습니다.

`filter` 속성은 흐림 효과나 **색상 변형** 등 **그래픽 효과**를 요소에 적용하며, 보통 이미지, 배경, 테두리 렌더링을 조정하는 데 쓰입니다.

```css
filter: blur(5px);
filter: brightness(0.4);
filter: contrast(200%);
filter: drop-shadow(16px 16px 20px blue);
filter: grayscale(50%);
filter: hue-rotate(90deg);
filter: invert(75%);
filter: opacity(25%);
filter: saturate(30%);
filter: sepia(60%);
```

- `blur`는 이미지에 **가우시안 블러**를 적용합니다.

- `brightness`는 이미지를 **밝거나 어둡게** 표시합니다.
  0%일 경우 완전히 검은색 이미지가 되고, 100%일 경우 이미지가 그대로 유지됩니다.

- `constrast`는 이미지의 **대비**를 조정합니다.
  0%일 경우 완전히 회색 이미지가 되고, 100%일 경우 이미지가 그대로 유지됩니다.

- `drop-shadow`는 이미지에 **그림자 효과**를 적용합니다.
  함수의 인자는 `<offset-x> <offset-y> <blur-radius> <color>`입니다.

- `grayscale`는 이미지를 **흑백**으로 변환합니다.
  100%일 경우 완전히 흑백 이미지가 되고, 0%일 경우 이미지가 그대로 유지됩니다.

- `hue-rotate`는 이미지에 **색조 회전**을 적용합니다.
  0deg일 경우 이미지가 그대로 유지됩니다.

- `invert`는 이미지의 **색**을 반전합니다.
  100%일 경우 색을 정반대로 바꾸고, 0%일 경우 이미지가 그대로 유지됩니다.

- `saturate`는 이미지의 **채도**를 변경합니다.
  0%일 경우 완전히 무채색이 되고, 100%일 경우 이미지가 그대로 유지됩니다.

- `sepia`는 이미지를 **세피아**로 변환합니다.
  100%일 경우 완전히 세피아가 되고, 0%에서는 이미지가 그대로 유지됩니다.

만약 **검은색** 이미지를 **빨간색**으로 바꾸고 싶다면 아래와 같이 `filter`를 설정하면 됩니다.

```html
<img class="icon" src="icon_black.svg" alt="icon">
```

```css
.icon:hover {
    filter: invert(16%) sepia(89%) saturate(6054%) hue-rotate(358deg) brightness(97%) contrast(113%);
}
```

원하는 `filter` 값을 찾을 때는 [CSS filter generator to convert from black to target hex color](https://codepen.io/sosuke/pen/Pjoqqp) 이용을 **추천**합니다.

참고: [How to transform black into any given color using only CSS filters](https://stackoverflow.com/questions/42966641/how-to-transform-black-into-any-given-color-using-only-css-filters/43960991#43960991)
