---
title: "응~ HTML 가져와봐ㅋㅋ Beautiful Soup 쓰면 그만이야: Beautiful Soup를 이용한 HTML 파싱"
date: 2022-03-13
author: Astro36
category: python
tags: [python, pypi, beautifulsoup, bs4, html, parse]
thumbnail: /assets/posts/2022-03-13-html-beautifulsoup/thumbnail.jpg
---

[Beautiful Soup](http://www.crummy.com/software/BeautifulSoup/bs4/)는 Python의 대표적인 **HTML 파싱** 라이브러리입니다.

Beautiful Soup를 이용하면 **웹 브라우저의 자바스크립트**에서 [`document.querySelector`](https://developer.mozilla.org/ko/docs/Web/API/Document/querySelector)처럼, **CSS Selector**를 이용해 HTML 내의 **구성요소에 접근하고 수정**할 수 있습니다.

때문에 [Requests](https://docs.python-requests.org/en/latest/) 라이브러리를 이용해 가져온 **HTML 데이터**에서 필요한 **값을 추출**하는 용도로 사용하곤 합니다.

그럼 PyPI를 이용해 라이브러리를 **설치**해봅시다.

```txt
$ pip install beautifulsoup4
```

아래와 같이 코드에 `import` 합니다.

```py
from bs4 import BeautifulSoup
```

HTML 문자열을 입력으로 주어 `soup` 객체를 **생성**합니다.

`soup` 객체에는 **파싱된 HTML 데이터**가 담기게 됩니다.

```py
soup = BeautifulSoup(str_html, 'html.parser')
```

> 'html.parser' 대신 `lxml`을 이용하면 **더 빠른 분석**이 가능합니다.
>
> 단, `lxml`을 이용하기 위해서는 별도의 **라이브러리 설치**가 필요합니다.
>
> ```txt
> $ pip install lxml
> ```

`select` 함수는 CSS Selector를 이용해 HTML 내의 **구성요소에 접근**합니다.

```py
rows = soup.select('tbody:not(.hide) > tr')
```

이때 결과 값은 **배열**로 반환됩니다. 

최초로 만족하는 **하나의 원소**만 가져오고 싶을 때는 `select_one`을 이용할 수 있습니다.

```py
anchor = row[0].select_one('a.link')
```

`get`은 구성요소의 **속성(Attribute)을 가져오는 함수**입니다.

```py
url = anchor.get('href')
```

구성요소 **안의 내용**을 가져올 때는 `.string`을 사용합니다.

```py
title = str(anchor.string)
```

> `.string`은 **Element를 반환**하기 때문에, **문자열 타입**을 원한다면 `str`으로 감싸야 합니다.

`next_sibling`과 `next_element`를 이용하면 HTML **구성요소 전후로 이동**할 수 있습니다.

```html
<h1>Hi</h1>
<p>Hello</p>
```

```py
h1 = soup.select('h1')
print(h1.next_sibling) # <p>Hello</p>
print(h1.next_element) # Hi
```

`previous_sibling`과 `previous_element`는 **반대 방향**으로 움직입니다.

참고: [Beautiful Soup Documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
