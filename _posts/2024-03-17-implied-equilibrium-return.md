---
title: "내재 균형 수익률"
date: 2024-03-17
author: Astro36
category: python
tags: [python, modern_portfolio_theory, black_litterman_model, optimization_problem, reverse_optimization]
---

**내재 균형 수익률**(Implied Equilibrium Return)은 **블랙-리터먼 모델**(Black-Litterman Model)에서 사용되는 개념으로,

금융 시장에서 **시장 참여자들이 예상**하는 **기대수익률**을 의미합니다.

## 계산 과정

내재 균형 수익률은 **시장이 균형 상태**에 있다는 가정에서 시작합니다.

시장 균형 상태란 모든 투자자들이 자신의 위험 선호도에 따라 최적의 포트폴리오를 구성했을 때, 자산의 수요와 공급이 일치하는 상태를 의미합니다.

즉, 현재 시장 포트폴리오가 **최적-위험 포트폴리오**라고 가정했기 때문에, **역최적화** 과정을 통해 내재 균형 수익률을 계산할 수 있습니다.

### 최적-위험 포트폴리오

[이전 포스트](https://int-i.github.io/python/2023-12-13/portfolio-mvo/)에서 포트폴리오의 **기대수익률** $$\mu_p$$과 **분산** $$\sigma_p^2$$은 각각 $$\mathbf{w}^\mathsf{T}E(r)$$와 $$\mathbf{w}^\mathsf{T}\mathbf{\Sigma w}$$가 됨을 확인했습니다.

최적-위험 포트폴리오는 **기대수익률은 커지고 위험은 작아지도록** 하는 $$\mathbf{w}$$를 찾습니다.

$$\max_{\mathbf{w}}{\mathbf{w}^\mathsf{T}E(r)-\lambda\mathbf{w}^\mathsf{T}\mathbf{\Sigma w}}$$

여기서 $$\lambda$$는 투자자의 **위험 회피성향**(Risk aversion)을 나타냅니다.

최적-위험 포트폴리오를 구할 때는 위 식을 그대로 계산해 $$\mathbf{w}$$를 구하면 되지만,

내재 균형 수익률을 구할 때는 $$\mathbf{w}$$(시가총액)을 이미 알고 있는 상태에서 $$E(r)$$을 역산해야 합니다.

### 역최적화

기울기가 0이 되는 지점에서 $$\mathbf{w}^\mathsf{T}E(r)-\lambda\mathbf{w}^\mathsf{T}\mathbf{\Sigma w}$$는 최대가 됩니다.

$$\frac{\partial}{\partial\mathbf{w}}(\mathbf{w}^\mathsf{T}E(r)-\lambda\mathbf{w}^\mathsf{T}\mathbf{\Sigma w})=0$$

$$E(r)-2\lambda\mathbf{\Sigma w}=0$$

$$E(r)=2\lambda\mathbf{\Sigma w}$$

이렇게 시장의 $$\mathbf{w}$$로부터 구한 $$E(r)$$을 내재 균형 수익률 $$\Pi$$라고 합니다.

$$\Pi=2\lambda\mathbf{\Sigma w}\quad\cdots(1)$$

### 위험 회피성향

위험 회피성향은 **위험 한 단위**당 투자자가 요구하는 **초과수익률**을 의미합니다.

일반적으로 1.1~1.7 사이의 **상수**를 설정하며, 아래 식을 통해 계산할 수 있습니다.

$$\lambda=\frac{E(r_m)-r_f}{\sigma_m^2}\quad\cdots(2)$$

위험 회피성향은 블랙-리터만 모형에서 내재 균형 수익률에 대한 **Scaling Factor** 역할을 합니다.

## 실습

내재 균형 수익률을 계산하기 위해서는 **시장 전체 종목**에 대해 $$\mathbf{w}$$를 구해야 하지만,

실습에서는 시장이 아래 5개의 종목으로만 구성되어 있다고 가정하고 실습을 진행했습니다.

`SK하이닉스`, `현대차`, `NAVER`, `POSCO홀딩스`, `LG화학` 다섯 개 종목의 주가 데이터를 다운로드합니다.

```py
import yfinance as yf

tickers = ['000660.KS', '005380.KS', '035420.KS', '005490.KS', '051910.KS']
df = yf.download(tickers, start='2019-01-01')
prices = df["Adj Close"].dropna(how="all")
returns = prices.pct_change().dropna(how="all")
```

**시가총액**을 통해 $$\mathbf{w}$$를 계산합니다.

```py
outstanding_shares = {
    '000660.KS': 728002365,
    '005380.KS': 211531506,
    '035420.KS': 162408594,
    '005490.KS': 84571230,
    '051910.KS': 70592343,
}
market_caps = { ticker: (prices[ticker][-1] * shares) for ticker, shares in outstanding_shares.items() }
```

```py
import matplotlib.pyplot as plt

plt.pie(market_caps.values(), labels=market_caps.keys())
plt.show()
```

![market_caps](/assets/posts/2024-03-17-implied-equilibrium-return/market_caps.png)

```py
import pandas as pd

total_market_cap = sum(market_caps.values())
market_weights = pd.Series(market_caps.values(), index=market_caps.keys()).sort_index() / total_market_cap
```

위험 회피성향 $$\lambda$$를 계산하기 위해 KOSPI(시장) 주가 데이터를 다운로드합니다.

```py
market_prices = yf.download('^KS11', start='2019-01-01')["Adj Close"].dropna(how="all")
market_returns = market_prices.pct_change().dropna(how="all")
```

(2)식을 이용해 **위험 회피성향**을 계산합니다.

무위험 수익률 $$r_f$$는 최근 **KOFR 금리**인 `3.5%`로 설정했습니다.

$$\lambda=\frac{E(r_m)-r_f}{\sigma_m^2}\quad\cdots(2)$$

```py
market_expected_return = market_returns.mean() * 252
market_variance = market_returns.var() * 252
risk_free_rate = 0.032

lambd = (market_expected_return - risk_free_rate) / market_variance
```

```txt
1.15769
```

구한 $$\lambda$$와 (1)식을 이용해 **내재 균형 수익률** $$\Pi$$를 계산합니다.

$$\Pi=2\lambda\mathbf{\Sigma w}\quad\cdots(1)$$

```py
covariances = returns.cov() * 252

implied_returns = 2 * lambd * covariances @ market_weights
```

```txt
Ticker
000660.KS    0.191574
005380.KS    0.129324
005490.KS    0.127047
035420.KS    0.111430
051910.KS    0.153293
dtype: float64
```

즉, **시장 참여자들이 예상**하는 각 종목의 **기대수익률**은 아래와 같습니다.

- `SK하이닉스`: 19.2%
- `현대차`: 12.9%
- `NAVER`: 12.7%
- `POSCO홀딩스`: 11.1%
- `LG화학`: 15.3%

### CAPM 기대수익률

각 종목의 **베타**는 아래와 같이 구합니다.

$$\beta_i=\frac{Cov(r_m, r_i)}{Var(r_m)}$$

```py
import numpy as np

betas = pd.Series([(np.cov(returns[ticker], market_returns)[0, 1] * 252) for ticker in tickers], index=tickers) / market_variance
```

```txt
000660.KS    1.226145
005380.KS    1.072191
035420.KS    0.932683
005490.KS    1.097457
051910.KS    1.342015
dtype: float64
```

> 네이버증권에서 제공하는 52주 베타는 일일 수익률이 아닌, 주간 수익률 기준 베타입니다.

**CAPM** 공식은 아래와 같습니다.

$$E(r_i)=r_f+\beta_i(E(r_m)-r_f)$$

```py
expected_returns = risk_free_rate + betas * (market_expected_return - risk_free_rate)
```

```txt
000660.KS    0.082979
005380.KS    0.076578
035420.KS    0.070778
005490.KS    0.077629
051910.KS    0.087796
dtype: float64
```

CAPM을 통해 계산한 각 종목의 **기대수익률**은 아래와 같습니다.

- `SK하이닉스`: 8.3%
- `현대차`: 7.7%
- `NAVER`: 7.1%
- `POSCO홀딩스`: 7.8%
- `LG화학`: 8.8%

내재 균형 수익률과 비교하면 아래와 같습니다.

```py
implied_returns.plot.bar()
expected_returns.plot.bar()
```

| 내재 균형 수익률 | CAPM 기대수익률 |
| --- | --- |
| ![implied_returns](/assets/posts/2024-03-17-implied-equilibrium-return/implied_returns.png) | ![expected_returns](/assets/posts/2024-03-17-implied-equilibrium-return/expected_returns.png) |

참고: [블랙-리터만 모형 - Qvious, Inc.](https://qvious.com/docs/1-2-3-2_BL/)

참고: [Python으로 블랙리터만 (Black-Litterman) 모델 구현하기](https://hwangheek.github.io/2021/black-litterman/)

참고: [Black-Litterman Allocation - PyPortfolioOpt](https://pyportfolioopt.readthedocs.io/en/latest/BlackLitterman.html)
