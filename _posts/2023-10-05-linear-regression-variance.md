---
title: "최소 제곱 추정량의 기댓값과 분산 증명"
date: 2023-10-05
author: Astro36
category: r
tags: [r, math, linear_regression, machine_learning, variance]
thumbnail: /assets/posts/2023-10-05-linear-regression-variance/thumbnail.jpg
---

**선형 회귀 분석**은 직선 형태의 **단순 회귀 함수**를 통해 두 변수 사이의 관계를 설명하거나 예측하는 **통계적 방법**으로,

**최소 제곱법**을 통해 $$b_1$$과 $$b_2$$를 추정할 수 있습니다.

$$y_i=\beta_1+\beta_2 x_i+e_i$$

이때, 추정한 $$b_1$$과 $$b_2$$가 얼마나 타당한가를 **평가**하기 위해서는 **모집단의 모수** $$\beta_1$$과 $$\beta_2$$과 비교해야 하지만,

우리는 $$\beta_1$$과 $$\beta_2$$의 **참값은 알 수 없기에** 얼마나 근접한지 **판단할 수 없습니다.**

$$b_1$$과 $$b_2$$는 모집단에서 추출한 **표본**을 토대로 **추정한 값**이기 때문에,

모집단에서 표본을 어떻게 뽑느냐에 따라 달라집니다.

이 현상을 **표본추출 변동**(sampling variation)이라 부릅니다.

따라서 $$b_1$$과 $$b_2$$를 **확률변수**로써 볼 수 있으며, 이때의 $$b_1$$과 $$b_2$$를 **최소 제곱 추정량**이라 부릅니다.

## 추정량 $$b_2$$

앞서 $$b_2$$는 아래와 같이 구할 수 있다고 정리했습니다.

$$b_2=\frac{\sum(x_i-\bar{x})(y_i-\bar{y})}{\sum(x_i-\bar{x})^2}$$

참고: [이 직선... 내 점들이 다 담아질까...? 단순 선형 회귀식 유도와 R 프로그래밍](https://int-i.github.io/r/2023-09-26/linear-regression/)

여기서 $$b_2$$를 약간 **변형**해봅시다.

$$b_2=\frac{\sum(x_i-\bar{x})(y_i-\bar{y})}{\sum(x_i-\bar{x})^2}=\frac{\sum(x_i-\bar{x})y_i}{\sum(x_i-\bar{x})^2}=\sum(\frac{(x_i-\bar{x})}{\sum(x_i-\bar{x})^2})y_i$$

$$\frac{(x_i-\bar{x})}{\sum(x_i-\bar{x})^2}$$를 $$w_i$$로 **치환**합니다.

$$b_2=\sum w_i y_i\quad\cdots(1)$$

$$w_i=\frac{(x_i-\bar{x})}{\sum(x_i-\bar{x})^2}\quad\cdots(2)$$

> (1)식을 **선형 추정량**(linear estimator) 형태라고 합니다.

$$y_i$$ 자리에 $$\beta_1+\beta_2 x_i+e_i$$를 **대입**합니다.

$$b_2=\sum w_i y_i=\sum w_i(\beta_1+\beta_2 x_i+e_i)$$

$$=\beta_1\sum w_i+\beta_2 \sum w_i x_i+\sum w_i e_i)$$

$$\sum w_i=0$$과 $$\sum w_i x_i=1$$를 이용해서 식을 **정리**합니다.

> **증명 1**
>
> $$\sum w_i=\sum(\frac{(x_i-\bar{x})}{\sum(x_i-\bar{x})^2})=\frac{1}{\sum(x_i-\bar{x})^2}\sum(x_i-\bar{x})$$
>
> $$\sum(x_i-\bar{x})=0$$이므로,
>
> $$\sum w_i=\frac{1}{\sum(x_i-\bar{x})^2}\times 0=0$$

> **증명 2**
>
> $$\sum w_i x_i=\sum(\frac{(x_i-\bar{x})}{\sum(x_i-\bar{x})^2})x_i=\frac{\sum(x_i-\bar{x})x_i}{\sum(x_i-\bar{x})^2}$$
> 
> $$\sum(x_i-\bar{x})x_i=\sum(x_i-\bar{x})^2$$이므로,
> 
> $$\sum w_i x_i=\frac{\sum(x_i-\bar{x})^2}{\sum(x_i-\bar{x})^2}=1$$

$$b_2=\beta_1\sum w_i+\beta_2 \sum w_i x_i+\sum w_i e_i)=\beta_2+\sum w_i e_i\quad\cdots(3)$$

## 추정량 $$b_1$$

$$\bar{y}=b_1+b_2\bar{x}$$이므로, $$b_1=\bar{y}-b_2\bar{x}$$입니다.

$$b_1$$도 $$b_2$$와 마찬가지로, **선형 추정량** 형태로 표현할 수 있습니다.

$$b_1=\bar{y}-b_2\bar{x}=(\frac{1}{N}\sum y_i)-(\sum w_i y_i)\bar{x}$$

$$y_i$$로 묶어줍니다.

$$b_1=\sum(\frac{1}{N}-\bar{x}w_i)y_i=\sum v_i y_i$$

따라서,

$$b_1=\sum v_i y_i\quad\cdots(4)$$

$$v_i=\frac{1}{N}-\bar{x}w_i=\frac{1}{N}-\frac{\bar{x}(x_i-\bar{x})}{\sum(x_i-\bar{x})^2}\quad\cdots(5)$$

(4)식 $$y_i$$ 자리에 $$\beta_1+\beta_2 x_i+e_i$$를 넣고 전개하면 $$b_2$$와 같이,

$$b_1=\beta_1+\sum v_i e_i\quad\cdots(6)$$

형태로 정리됩니다.

이때, $$v_i$$는 $$\sum v_i=0$$, $$\sum v_i x_i=1$$를 만족합니다.

## $$b_2$$의 기댓값

모수 **추정량의 기댓값**이 모수의 **참값**과 동일한 경우 그 추정량은 **불편**(unbiased)되었다고 합니다.

$$E(b_2)=\beta_2$$라면 최소제곱 추정량 $$b_2$$는 $$\beta_2$$의 **불편 추정량**이 됩니다.

$$E(b_2)=E(\beta_2+\sum w_i e_i)=E(\beta_2)+\sum E(w_i e_i)$$

$$\beta_2$$와 $$w_i$$는 확률적이지 않기 때문에,

$$E(b_2)=\beta_2+\sum w_i E(e_i)$$

> $$w_i$$는 $$x_i$$에만 영향을 받는데 $$x_i$$는 정해진 값이므로, $$w_i$$는 $$E$$ 밖으로 나올 수 있습니다.

$$\sum E(e_i)=0$$이므로,

$$E(b_2)=\beta_2\quad\cdots(7)$$

> 오차항의 **평균은 0**이고 오차항은 **불편성**을 보입니다.

따라서 추정량 $$b_2$$이 **불편성**을 보이는 것을 확인할 수 있습니다.

## $$b_1$$의 기댓값

$$b_2$$와 **증명** 방법이 **동일**합니다.

$$E(b_1)=E(\beta_1+\sum v_i e_i)=E(\beta_1)+\sum E(v_i e_i)$$

$$=\beta_1+\sum v_i E(e_i)=\beta_1\quad\cdots(8)$$

## $$b_2$$의 분산

$$b_2$$의 **분산**은 아래와 같이 정의됩니다.

$$var(b_2)=E[b_2-E(b_2)]^2$$

(3)식과 (7)식을 **대입**합니다.

$$var(b_2)=E[\beta_2+\sum w_i e_i-\beta_2]^2=E[\sum w_i e_i]^2$$

$$=E[w_1 e_1+w_2 e_2+\cdots+w_N e_N]^2$$

$$=E[\sum(w_i e_i)^2+2\sum \sum_{i\neq j} w_i e_i w_j e_j]$$

$$E$$ 밖으로 나올 수 있는 항을 꺼내줍니다.

$$var(b_2)=\sum w_i^2 E(e_i^2)+2\sum \sum_{i\neq j} w_i w_j E(e_i e_j)$$

$$E(e_i e_j)=0$$이므로,

$$var(b_2)=\sum w_i^2 E(e_i^2)$$

> **증명**
> 
> 오차항의 **공분산**은 0인데,
>
> $$cov(e_i, e_j)=E[(e_i-E(e_i))(e_j-E(e_j))]=0$$
>
> 오차창의 **평균**은 0이므로,
>
> $$E[(e_i-0)(e_j-0)]=E(e_i e_j)=0$$

$$E(e_i^2)$$는 아래와 같이 바꿔 쓸 수 있습니다.

$$var(e_i)=\sigma^2=E[e_i-E(e_i)]^2=E[e_i-0]^2=E(e_i^2)$$

$$\sum w_i^2$$는 아래처럼 **정리**됩니다.

$$\sum w_i^2=\sum(\frac{(x_i-\bar{x})}{\sum(x_i-\bar{x})^2})^2=\sum(\frac{(x_i-\bar{x})^2}{(\sum(x_i-\bar{x})^2)^2})$$

$$=\frac{\sum(x_i-\bar{x})^2}{(\sum(x_i-\bar{x})^2)^2}=\frac{1}{\sum(x_i-\bar{x})^2}\quad\cdots(9)$$

따라서,

$$var(b_2)=\sum w_i^2 \times E(e_i^2)=\frac{\sigma^2}{\sum(x_i-\bar{x})^2}\quad\cdots(10)$$

## $$b_1$$의 분산

$$b_2$$의 **분산**과 **증명** 방법이 **유사**합니다.

$$var(b_1)=E[b_1-E(b_1)]^2$$

(6)식과 (8)식을 **대입**합니다.

$$var(b_1)=E[\beta_1+\sum v_i e_i-\beta_1]^2=E[\sum v_i e_i]^2$$

$$var(b_2)$$ 증명과 **동일**하게 식을 **정리**합니다.

$$var(b_1)=\sum v_i^2 \times E(e_i^2)=\sigma^2\sum v_i^2$$

$$\sum v_i^2$$는 아래와 같이 구합니다.

$$\sum v_i^2=\sum(\frac{1}{N}-\frac{\bar{x}(x_i-\bar{x})}{\sum(x_i-\bar{x})^2})^2$$

$$=\sum(\frac{1}{N^2}-\frac{2\bar{x}(x_i-\bar{x})}{N\sum(x_i-\bar{x})^2}+\frac{\bar{x}^2(x_i-\bar{x})^2}{(\sum(x_i-\bar{x})^2)^2})$$

$$=\sum\frac{1}{N^2}-\sum\frac{2\bar{x}(x_i-\bar{x})}{N\sum(x_i-\bar{x})^2}+\sum\frac{\bar{x}^2(x_i-\bar{x})^2}{(\sum(x_i-\bar{x})^2)^2}$$

$$=\sum\frac{1}{N^2}-\sum\frac{2\bar{x}(x_i-\bar{x})}{N\sum(x_i-\bar{x})^2}+\frac{\bar{x}^2}{\sum(x_i-\bar{x})^2}$$

$$\sum(x_i-\bar{x})=0$$ 이므로,

$$\sum v_i^2=\sum\frac{1}{N^2}-\frac{2\bar{x}\times 0}{N\sum(x_i-\bar{x})^2}+\frac{\bar{x}^2}{\sum(x_i-\bar{x})^2}=\sum\frac{1}{N^2}+\frac{\bar{x}^2}{\sum(x_i-\bar{x})^2}$$

식을 **정리**합니다.

$$\sum v_i^2=\sum\frac{1}{N^2}+\frac{\bar{x}^2}{\sum(x_i-\bar{x})^2}=\frac{1}{N}+\frac{\bar{x}^2}{\sum(x_i-\bar{x})^2}$$

$$=\frac{\sum(x_i-\bar{x})^2+N\bar{x}^2}{N\sum(x_i-\bar{x})^2}=\frac{\sum(x_i^2-2x_i\bar{x}+\bar{x}^2)+N\bar{x}^2}{N\sum(x_i-\bar{x})^2}$$

$$=\frac{\sum x_i^2-2\sum x_i\bar{x}+\sum\bar{x}^2+N\bar{x}^2}{N\sum(x_i-\bar{x})^2}=\frac{\sum x_i^2-2N\bar{x}^2+N\bar{x}^2+N\bar{x}^2}{N\sum(x_i-\bar{x})^2}$$

$$=\frac{\sum x_i^2}{N\sum(x_i-\bar{x})^2}\quad\cdots(11)$$

따라서,

$$var(b_1)=\frac{\sigma^2\sum x_i^2}{N\sum(x_i-\bar{x})^2}\quad\cdots(12)$$
