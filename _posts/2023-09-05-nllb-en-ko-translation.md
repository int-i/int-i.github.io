---
title: "NLLB-200 모델을 이용한 기계번역"
date: 2023-09-05
author: Astro36
category: python
tags: [python, ai, deep_learning, nlp, translation, nllb, huggingface, pipeline, meta, facebook]
---

[NLLB-200](https://ai.meta.com/research/no-language-left-behind/ko/)은 Meta에서 개발한 **다국어 번역 모델**입니다.

제공하는 모델의 크기는 600M, 1.3B, 3.3B가 있고 이 중 **600M**과 **1.3B**는 경량화(Distilled)된 모델입니다.

참고: [딥러닝 Knowledge Distillation](https://tech.scatterlab.co.kr/ml-model-optimize-2/)

아스투리아스어, 루간다어, 우르두어 등 리소스가 적은 언어를 포함하여 **200개 언어** 간의 번역을 제공할 수 있는 **오픈소스 모델**이며, **한국어**도 당연히 포함되어 있습니다.

하지만, 연구 목적으로 배포된 모델이기 때문에 프로덕션용으로 사용하기 어려운 단점이 있습니다.

## HuggingFace Pipeline

NLLB 모델을 이용하는 가장 간편한 방법은 HuggingFace의 **Pipeline**을 이용하는 것입니다.

HuggingFace의 Pipeline은 모델에서의 **전처리, 후처리, 추론과정**을 묶어 **하나의 함수**로 제공하는 기능입니다.

Pipeline을 사용하기 위해서는 `torch`와 `transformers`가 필요합니다.

```txt
$ pip3 install torch --index-url https://download.pytorch.org/whl/cu118
```

참고: [Pytorch - Start Locally](https://pytorch.org/get-started/locally/)

```txt
$ pip install transformers
```

참고: [HuggingFace Installation](https://huggingface.co/docs/transformers/installation)

> **Conda**를 이용하는 경우 아래 명령어로 설치할 수 있습니다.
>
> ```txt
> conda install pytorch pytorch-cuda=11.8 -c pytorch -c nvidia
> conda install -c huggingface transformers
> ```

먼저 가장 용량이 작은 [600M 모델](https://huggingface.co/facebook/nllb-200-distilled-600M)로 **영어->한국어 번역**을 해보겠습니다.

모델을 돌리기 위해서는 **3GB 정도의 VRAM**이 필요합니다.

```py
from transformers import pipeline
translator = pipeline('translation', model= facebook/nllb-200-distilled-600M ', device=0, src_lang='eng_Latn', tgt_lang='kor_Hang', max_length=512)
```

`device=0`으로 설정한 이유는 CPU가 아니라 **GPU를 이용**해서 모델을 실행시키기 위함입니다.

입력 언어는 영어이므로 `src_lang`(source language)은 `eng_Latn`(English Latin)으로 지정하고, 출력 언어는 한국어이므로 `tgt_lang`(target language)는 `kor_Hang`(Korean Hangul)로 설정합니다.

[`nllb-200-distilled-600M`](facebook/nllb-200-distilled-600M) 모델은 **512 토큰 이하**의 데이터셋으로 학습되었기 때문에 이것보다 더 긴 내용의 입력이 들어오면 **번역 품질**이 저하될 수 있습니다.

실행은 아래와 같이 하면 됩니다.

```py
text = ‘Lockheed Martin Delivers Initial 5G Testbed To U.S. Marine Corps And Begins Mobile Network Experimentation’
output = translator(text, max_length=512)
print(output[0]['translation_text'])
```

```txt
록히드 마틴, 미 해병대에 초기 5G 테스트베드 제공 및 모바일 네트워크 실험 시작
```

번역이 자연스럽지 않다면, **더 큰 모델**(1.3B, 3.3B)을 이용해서 테스트해보세요. 일반적으로 **모델의 사이즈**가 클수록 번역이 자연스러워지지만 **많은 리소스**를 사용합니다.

## Fine-tuned Model

**NLLB**는 **범용적인 번역 모델**이기 때문에 뜻이 대충 통하는 문장을 생성할 뿐, 자연스러운 문장을 생성하기엔 **어려움**이 있습니다.

그렇기에 자연스러운 **영어->한국어 번역**을 위해서는 **한국어 데이터셋으로 Fine-tuning**하여 모델의 성능을 끌어올려야 합니다.

> **Fine-tuning**이란 기존의 학습된 모델을 새로운 목적의 맞게 재학습시키는 것을 말합니다.
> 
정석대로라면 직접 한국어 데이터셋을 구해서 모델을 Fine-tuning 해야 하지만, 다행히 누군가 이미 한국어 데이터셋으로 훈련시켜 둔 모델을 찾을 수 있었습니다.

[`nllb-finetuned-en2ko`](https://huggingface.co/NHNDQ/nllb-finetuned-en2ko)는 `facebook/nllb-200-distilled-600M`을 기반으로 한 **영어->한국어 번역 특화 모델**입니다.

해당 모델은 [AI-Hub](https://www.aihub.or.kr/)에서 구한 한국어 데이터셋으로 Fine-tuning 되었고 CC-BY-4.0로 공개되었습니다.

사용방법은 NLLB와 동일합니다.

```py
translator = pipeline('translation', model='NHNDQ/nllb-finetuned-en2ko', device=0, src_lang='eng_Latn', tgt_lang='kor_Hang', max_length=512)
text = ‘Lockheed Martin Delivers Initial 5G Testbed To U.S. Marine Corps And Begins Mobile Network Experimentation’
output = translator(text, max_length=512)
print(output[0]['translation_text'])
```

```txt
록히드 마틴, 미 해병대에 초기 5G 테스트베드 제공 및 모바일 네트워크 실험 시작
```

아까보다 더 자연스러운 문장이 생성된 것 같습니다.

## HuggingFace Models

[HuggingFace](https://huggingface.co/models?pipeline_tag=translation&sort=trending&search=ko)에서 다양한 **한국어 번역 모델**을 찾아볼 수 있습니다.

주의할 점은, `en-ko` 모델은 **영어를 한국어**로 번역하는 모델이고, `ko-en` 모델은 **한국어를 영어**로 번역하는 모델이란 점입니다.

**모델을 평가**하는 지표로는 **BLEU Score**가 있습니다.

BLEU Score(Bilingual Evaluation Understudy Score)는 **n-gram**을 이용해 기계 번역 결과와 사람이 직접 번역한 결과가 얼마나 **유사**한지 비교하여 번역에 대한 성능을 측정하는 방법입니다.

**Score가 높을수록 더 좋은 성능**을 보여주는 모델이라는 의미입니다.

![NLLB BLEU Score](https://scontent.ficn2-2.fna.fbcdn.net/v/t39.2365-6/288199290_556570179362789_8110046528855215860_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=ad8a9d&_nc_ohc=ziYmB-AuojsAX_xxx-2&_nc_ht=scontent.ficn2-2.fna&oh=00_AfCGEJeVGDmayQ37BVQXN01fx-5hJwJIEuYaO4upYLxV-Q&oe=65110EB7)

위의 `nllb-finetuned-en2ko`의 BLUE Score는 33.66으로 NLLB-200 3.3B(Baseline)의 BLUE가 33.45인 것을 고려하면 Fine-tuning을 통해 **더 적은 용량으로 높은 성능**을 달성했다는 것을 확인할 수 있습니다.

> 위 그림에서 37.84점을 기록한 NLLB-200은 54B 크기의 MoE(Mixture-of-Experts) 모델입니다.
