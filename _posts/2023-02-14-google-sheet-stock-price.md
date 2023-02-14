---
title: "구글 스프레드시트로 주식 정보 불러오기 (w/ Yahoo Finance)"
date: 2023-02-14
author: Astro36
category: javascript
tags: [google_sheets, google_finance, google_apps_script, gas, javascript]
thumbnail: /assets/posts/2023-02-14-google-sheet-stock-price/thumbnail.jpg
---

[구글 스프레드시트](https://www.google.com/intl/ko/sheets/about/)는 마이크로소프트의 **엑셀**과 같은 서비스입니다.

**구글 드라이브**와 연동되며, 엑셀의 **VBA** 같은 **구글 앱스 스크립트**(Google Apps Script) 기능이 있기 때문에 자동으로 웹에서 데이터를 가져오는 등의 기능을 구현할 수도 있습니다.

참고: [[VBA] 엑셀 매크로 시작 완벽 가이드](https://kukuta.tistory.com/397)

**구글 앱스 스크립트**는 **자바스크립트**로 작성하기 때문에 VBA보다 진입장벽이 낮고, 다양한 **유틸 함수**와 **사용법 문서**를 제공하기 때문에 원하는 기능을 구현하기도 쉽습니다.

참고: [Apps Script | Google Developers](https://developers.google.com/apps-script/reference?hl=ko)

## Google Finance

[Google Finance](https://www.google.com/finance/)는 구글의 **주식 정보** 시스템입니다.

![samsung](/assets/posts/2023-02-14-google-sheet-stock-price/samsung.png)

> "삼성전자" 검색

`삼성전자`를 검색하게 되면 **삼성전자 주식**의 현재 **가격**과 **배당수익률** 등을 모아서 보여주게 됩니다.

검색창의 `KRX: 005930`은 삼성전자 주식의 식별자입니다.

**KRX**는 KoRea eXchange의 약자로 **한국거래소**에서 거래되고 있다는 의미이며,

`NAVER`는 `035420`, `카카오`는 `035720`과 같이 `005930`는 주식마다 부여되는 고유한 아이디로, **티커**(Ticker)라고 불립니다.

![apple](/assets/posts/2023-02-14-google-sheet-stock-price/apple.png)

> "애플" 검색

미국의 "애플"을 검색하면 `NASDAQ: AAPL`으로 검색됩니다.

삼성전자와 동일하게 `:`을 기준으로 앞 쪽은 **거래소**를 의미하며 뒤는 주식의 **티커**를 의미합니다.

`NASDAQ`은 미국의 **나스닥 증권거래소**를 의미하고, `AAPL`은 애플(APPLE)의 **티커**입니다.

미국은 숫자를 사용하는 한국과 다르게 **알파벳**을 이용해 **티커**를 만듭니다.

**구글 스프레드시트**에는 **Google Finance**의 정보를 가져오는 **함수**를 제공합니다.

`=GOOGLEFINANCE( ticker )`를 통해 현재 주식 가격을 불러올 수 있습니다.

![spreadsheets_aapl](/assets/posts/2023-02-14-google-sheet-stock-price/spreadsheets_aapl.png)

![spreadsheets_aapl_output](/assets/posts/2023-02-14-google-sheet-stock-price/spreadsheets_aapl_output.png)

참고: [GOOGLEFINANCE 도움말](https://support.google.com/docs/answer/3093281?hl=ko)

![spreadsheets_table](/assets/posts/2023-02-14-google-sheet-stock-price/spreadsheets_table.png)

이런식으로 **표** 형태로도 만들 수 있습니다.

한국, 미국 뿐만 아니라 다른 나라도 가능합니다.

![mbg](/assets/posts/2023-02-14-google-sheet-stock-price/mbg.png)

메르세데스-벤츠(님이 생각하는 독일 외제차 회사 맞음)의 모회사인 `다임러 AG`를 검색하면 `ETR: MBG`으로 검색됩니다.

`ETR`은 유럽의 **도이체 뵈르제 XETRA 거래소**를 의미합니다.

유럽 주식은 **티커** 앞에 **거래소 명칭**까지 넣어야 제대로 값을 불러올 수 있습니다: `=GOOGLEFINANCE("ETR:MBG")`

![spreadsheets_table_mbg](/assets/posts/2023-02-14-google-sheet-stock-price/spreadsheets_table_mbg.png)

거래소 명칭은 [Finance 데이터 목록 및 면책 조항](https://www.google.com/googlefinance/disclaimer/)를 참고하면 됩니다.

## Yahoo Finance

하지만, `GOOGLEFINANCE`를 통해 모든 나라의 주식 정보를 불러올 수는 없습니다.

대표적으로 일본 주식은 `GOOGLEFINANCE` 함수를 지원하지 않습니다.

![nintendo](/assets/posts/2023-02-14-google-sheet-stock-price/nintendo.png)

![spreadsheets_table_nintendo](/assets/posts/2023-02-14-google-sheet-stock-price/spreadsheets_table_nintendo.png)

스프레드시트에 일본 **닌텐도** 주식 정보 불러오고자 한다면, Google Finance가 아닌 다른 출처를 이용해야 합니다.

[Yahoo Finance](https://finance.yahoo.com/)는 대표적인 **주식 정보** 사이트로, Google Finance보다 더 다양한 주식 정보를 볼 수 있습니다.

다만, **스프레드시트**에는 Yahoo Finance 정보를 가져오는 함수가 없기 때문에, **Apps Script**를 이용해 직접 함수를 만들어야 합니다.

![apps_script_menu](/assets/posts/2023-02-14-google-sheet-stock-price/apps_script_menu.png)

`확장 프로그램 > Apps Script`를 열어줍니다.

그리고 `YAHOOFINANCE` 함수를 만드는 아래 코드를 입력하고 파일을 저장합니다.

```js
/**
 * Fetch stock price from Yahoo Finance
 * @param {string} ticker Stock ticker
 * @customfunction
 */
function YAHOOFINANCE(ticker) {
  const response = UrlFetchApp.fetch(`https://finance.yahoo.com/quote/${ticker}`);
  let data = response.getContentText();
  data = data.substring(data.search('data-field="regularMarketPrice" data-trend="none" data-pricehint="2" value="') + 76);
  data = data.substring(0, data.search('" active='));
  return parseInt(data);
}
```

참고: [UrlFetchApp | Apps Script | Google Developers](https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app?hl=ko)

다시 **스프레드시트**로 돌아와서 닌텐도 주식을 불러오도록 명령합니다: `=YAHOOFINANCE("7974.T")`

![spreadsheets_nintendo](/assets/posts/2023-02-14-google-sheet-stock-price/spreadsheets_nintendo.png)

**Yahoo Finance**는 주식 정보를 검색하는 **방법**이 조금 다릅니다.

`7974` 티커를 먼저 쓰고, `.` 뒤에 거래소 이름을 입력합니다.

`T`는 **도쿄 증권거래소**라는 의미입니다.

정보 사이트마다 거래소를 가리키는 이름이 **다르기** 때문에 주의해서 작성해야 합니다.

만약, `YAHOOFINANCE`를 이용해 `다임러 AG` 주가를 불러오려면 아래와 같이 작성합니다.

![spreadsheets_mbg](/assets/posts/2023-02-14-google-sheet-stock-price/spreadsheets_mbg.png)

`DE`는 독일 거래소 정보라는 뜻입니다.
