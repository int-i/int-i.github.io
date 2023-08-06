---
title: "Huggingface Pipeline과 BART를 이용한 텍스트 요약"
date: 2023-08-07
author: Astro36
category: python
tags: [python, ai, deep_learning, nlp, summarization, bart, huggingface, pipeline, meta, facebook]
thumbnail: /assets/posts/2023-08-07-huggingface-pipeline-summarization/thumbnail.jpg
---

텍스트 요약은 크게 **추출적 요약**(extractive summarization)과 **추상적 요약**(abstractive summarization)으로 구분됩니다.

**추출적 요약**은 원문에서 **중요한 핵심 문장 몇 개** 뽑아서 이들로 구성된 요약문을 만듭니다.

그렇기에, 출력은 모두 원문에 있는 문장으로 구성됩니다.

대표적인 알고리즘으론 구글에서 개발한 **TextRank**가 있습니다.

참고: [문서 요약 하기 (with textrank)](https://hoonzi-text.tistory.com/68)

**추상적 요약**은 사람과 같이, 원문 전체를 이해하고 **핵심 문맥**을 정리하여 **새로운 문장을 생성**합니다.

추출적 요약보다 **난이도**가 높지만 문장이 더 **자연스럽**습니다.

대표적으로 **seq2seq**와 같은 **인공신경망**을 이용하는 기법이 있습니다.

참고: [어텐션을 이용한 텍스트 요약(Text Summarization with Attention mechanism)](https://wikidocs.net/72820)

[bart-large-cnn](https://huggingface.co/facebook/bart-large-cnn)는 **추상적 요약**에 사용되는 대표적인 모델입니다.

[BART](https://arxiv.org/abs/1910.13461)는 **2019년 페이스북**(메타)에서 공개했고, `bart-large-cnn`는 **4억개의 파라미터**를 가지고 있는 BART large를 [CNN Dailymail Dataset](https://huggingface.co/datasets/cnn_dailymail)으로 **파인 튜닝**(fine-tuned)한 모델입니다.

참고: [BART 논문 리뷰](https://velog.io/@choonsik_mom/BART-%EB%85%BC%EB%AC%B8-%EB%A6%AC%EB%B7%B0)

> CNN Dailymail Dataset은 **추출/추상적 요약**을 위한 CNN 및 Daily Mail 뉴스 기사(영어) 데이터 셋입니다.

## Pipeline

`bart-large-cnn`을 사용하는 가장 **간편한** 방법은, Huggingface의 **Pipeline**를 이용하는 것입니다.

[Huggingface Pipeline](https://huggingface.co/docs/transformers/main_classes/pipelines)은 **전처리, 후처리, 추론 과정**을 하나로 묶어, 간편하게 모델을 사용할 수 있게 합니다.

먼저 `transformers` 패키지를 설치합니다.

```txt
$ pip install transformers
```

참고: [Huggingface - Installation](https://huggingface.co/docs/transformers/installation)

그리고 아래와 같이 `pipeline(task, model)` 형식으로 `Pipeline`을 만들어 줍니다.

참고: [Huggingface - Pipeline abstraction](https://huggingface.co/docs/transformers/v4.31.0/en/main_classes/pipelines#transformers.pipeline)

```py
from transformers import pipeline

text = '''
The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.
'''

summarizer = pipeline('summarization', model='facebook/bart-large-cnn')

out = summarizer(text, max_length=128, min_length=32)
print(out)
```

위 코드를 실행하면 아래의 **요약문**이 나옵니다.

```txt
[{'summary_text': 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building. Its base is square, measuring 125 metres (410 ft) on each side. It is the second tallest free-standing structure in France after the Millau Viaduct.'}]
```

여기서 **GPU를 이용**해 실행하려면 `device=0`을 붙여줍니다.

```py
summarizer = pipeline('summarization', model='facebook/bart-large-cnn', device=0)
```

`bart-large-cnn`은 입력으로 **1024 토큰**까지만 받을 수 있습니다.

입력이 너무 많다면, 아래와 같이 오류가 발생하게 됩니다.

```txt
Token indices sequence length is longer than the specified maximum sequence length for this model (1364 > 1024). Running this sequence through the model will result in indexing errors
```

## Large Input Summarization

입력의 크기가 너무 크다면, 적당히 **작은 크기로 잘라서** 모델에 넣어줘야 합니다.

그래서 MapReduce 기법을 응용하여, 본문을 **적당한 조각**으로 자른 후 각각의 **요약문을 합치고**, 요약문을 합친 것을 다시 모델에 넣는 방식으로 **대용량 입력**에 대응할 수 있습니다.

참고: [맵/리듀스 (Map/Reduce) 이해하기](https://cskstory.tistory.com/49)

텍스트를 조각으로 자르는 함수는 아래와 같이 구성했습니다.

```py
def get_overlapped_chunks(text, chunk, overlap):
    return [text[a:a+chunk] for a in range(0, len(text), chunk-overlap)]
```

참고: [Split very long character string into smaller character blocks with character overlap](https://stackoverflow.com/a/11636356)

조각 내용 일부가 겹치도록 **Overlap** 기능을 넣은 이유는, 단순히 **글자 수를 기준**으로 나누는 것이기 때문에 **단어와 문장 중간이 잘리면** 모델이 문맥을 **잘못 이해**할 수 있기 때문입니다.

```py
from transformers import pipeline


def get_overlapped_chunks(text, chunk, overlap):
    return [text[a:a+chunk] for a in range(0, len(text), chunk-overlap)]


text = '''
The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower... https://en.wikipedia.org/wiki/Eiffel_Tower
'''

summarizer = pipeline('summarization', model='facebook/bart-large-cnn', device=0)

outs = []
for chunk in get_overlapped_chunks(text, 1024, 64):
    out = summarizer(chunk, max_length=128, min_length=32)
    outs.append(out[0]['summary_text'])

print('\n'.join(outs))
```

`text` 입력으로는 [Wikipedia - Eiffel Tower](https://en.wikipedia.org/wiki/Eiffel_Tower)의 본문을 넣었습니다.

```txt
The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It was constructed from 1887 to 1889 as the centerpiece of the 1889 World's Fair. The tower is 330 metres (1,083 ft) tall, about the same height as an 81-storey building.
The Eiffel Tower is the second tallest free-standing structure in France. It is 276 metres (906 ft) above the ground and is the highest observation deck in the European Union. Its base is 125 metres (410 ft) on each side.    
The design of the Eiffel Tower is attributed to Maurice Koechlin and Émile Nouguier, two senior engineers. It was envisioned after discussion about a suitable centerpiece for the proposed 1889 Exposition Universelle, a world's fair to celebrate the centennial of the French Revolution. The climb from ground level to the first level is over 300 steps.
Koechlin, Nougier, and Sauvestre first sketched their idea in May 1884. Eiffel initially showed little enthusiasm, but he did approve further study. The design was put on display at the Exhibition of Decorative Arts in the autumn of 1884 under the company name.
Little progress was made until 1886, when Jules Grévy was re-elected as president of France and Édouard Lockroy was appointed as minister for trade. Lockroy announced an alteration to the terms of the open competition being held for a centrepiece to the exposition. This effectively made the selection of Eiffel's design a foregone conclusion, as entries had to include a study for a 300 m (980 ft) four-sided metal tower.
After some debate about the exact location of the tower, a contract was signed on 8 January 1887. Eiffel signed it acting in his own capacity rather than as the representative of his company. A French bank, the Crédit Industriel et Commercial (CIC), helped finance the construction.
During the period of the tower's construction, the CIC was acquiring funds from predatory loans to the National Bank of Haiti. These loans were connected to an indemnity controversy which saw France force Haiti's government to financially compensate French slaveowners for lost income as a result of the Haitian Revolution.
```

하지만, 이러면 n개의 `chunk`를 요약해서 그냥 합치기 때문에 **중요하지 않은 뒤 내용**이 같이 출력됩니다.

그렇기에, 최종으로 `chunk`를 합치고 나면 마지막으로 `summarizer`를 **한 번 더 호출**하는 것이 보기 낫습니다.

```py
from transformers import pipeline


def get_overlapped_chunks(text, chunk, overlap):
    return [text[a:a+chunk] for a in range(0, len(text), chunk-overlap)]


text = '''
The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower... https://en.wikipedia.org/wiki/Eiffel_Tower
'''

summarizer = pipeline('summarization', model='facebook/bart-large-cnn', device=0)

outs = []
for chunk in get_overlapped_chunks(text, 1024, 64):
    out = summarizer(chunk, max_length=128, min_length=32)
    outs.append(out[0]['summary_text'])

text = summarizer('\n'.join(outs), max_length=128, min_length=32)[0]['summary_text']
print(text)
```

```txt
The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It was constructed from 1887 to 1889 as the centerpiece of the 1889 World's Fair. The tower is 330 metres (1,083 ft) tall, about the same height as an 81-storey building.
```

이렇게 하면, 상대적으로 중요하지 않은 에펠탑의 역사에 대한 내용은 삭제됩니다.

`text` 입력의 크기가 매우 커서 한 번의 `get_overlapped_chunks`로는 요약문의 크기가 **1024 토큰 이하**로 줄어들지 않는다면,

`while`을 이용해 **1024자 이하**가 될 때까지 `summarizer`를 호출하면 됩니다.

```py
from transformers import pipeline


def get_overlapped_chunks(text, chunk, overlap):
    return [text[a:a+chunk] for a in range(0, len(text), chunk-overlap)]


text = '''
The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower... https://en.wikipedia.org/wiki/Eiffel_Tower
'''

summarizer = pipeline('summarization', model='facebook/bart-large-cnn', device=0)

while len(text) > 1024:
    outs = []   
    for chunk in get_overlapped_chunks(text, 1024, 64):
        out = summarizer(chunk, max_length=128, min_length=32)
        outs.append(out[0]['summary_text'])
    text = '\n'.join(outs)

text = summarizer('\n'.join(outs), max_length=128, min_length=32)[0]['summary_text']
print(text)
```

```txt
The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris. It was constructed from 1887 to 1889 as the centerpiece of the 1889 World's Fair. The tower is 330 metres (1,083 ft) tall and is the highest observation deck in the European Union.
```

## Pipeline Batching

파이프라인 배치(Pipeline Batching) 기능을 이용하면 **작업을 병렬**로 수행할 수 있습니다.

배치(Batch)는 `batch_size=4` 인자와 `Dataset` 객체를 통해 구현할 수 있습니다.

```py
from torch.utils.data import Dataset
from transformers import pipeline


class ListDataset(Dataset):
    def __init__(self, dataset: Dataset):
        self.dataset = dataset

    def __len__(self):
        return len(self.dataset)

    def __getitem__(self, i):
        return self.dataset[i]


def get_overlapped_chunks(text, chunk, overlap):
    return [text[a:a+chunk] for a in range(0, len(text), chunk-overlap)]


text = '''
The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower... https://en.wikipedia.org/wiki/Eiffel_Tower
'''

summarizer = pipeline('summarization', model='facebook/bart-large-cnn', device=0)

while len(text) > 1024:
    outs = []
    for out in summarizer(ListDataset(get_overlapped_chunks(text, 1024, 64)), batch_size=4, max_length=128, min_length=32):
        outs.append(out[0]['summary_text'])
    text = '\n'.join(outs)

text = summarizer('\n'.join(outs), max_length=128, min_length=32)[0]['summary_text']
print(text)
```

```txt
The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris. It was constructed from 1887 to 1889 as the centerpiece of the 1889 World's Fair. The tower is 330 metres (1,083 ft) tall and is the highest observation deck in the European Union.
```

`batch_size`는 무조건 크다고 빠른 것이 아닙니다.

너무 큰 `batch_size`는 **병렬화 오버헤드** 때문에 오히려 **성능이 나빠**질 수 있습니다.

`batch_size`를 조정하면서 가장 성능이 잘 나오는 `batch_size`를 **찾는 것**이 중요합니다.

특히, **CPU만 사용**할 때 `batch_size`를 사용하면 거의 항상 성능이 떨어집니다. 

```py
from torch.utils.data import Dataset
from transformers import pipeline


class ListDataset(Dataset):
    def __init__(self, dataset: Dataset):
        self.dataset = dataset

    def __len__(self):
        return len(self.dataset)

    def __getitem__(self, i):
        return self.dataset[i]


def get_overlapped_chunks(text, chunk, overlap):
    return [text[a:a+chunk] for a in range(0, len(text), chunk-overlap)]


text = '''
The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower... https://en.wikipedia.org/wiki/Eiffel_Tower
'''

summarizer = pipeline('summarization', model='facebook/bart-large-cnn', device=0)

for batch_size in [4, 8, 16, 32, 64]:
    print('-' * 30)
    print(f'Streaming batch_size={batch_size}')
    dataset = ListDataset(get_overlapped_chunks(text, 1024, 64))
    for out in tqdm(summarizer(dataset, batch_size=batch_size, max_length=128, min_length=32), total=len(dataset)):
        pass
```

참고: [Huggingface - Pipeline Batching](https://huggingface.co/docs/transformers/v4.31.0/en/main_classes/pipelines#pipeline-batching)

## Example

아래는 `bart-large-cnn`을 이용해 [Apple의 2022년 연간보고서(10-K)](https://www.sec.gov/ix?doc=/Archives/edgar/data/320193/000032019322000108/aapl-20220924.htm)의 `Item 1. Business`를 요약한 결과입니다.
`max_length` 등의 일부 파라미터가 수정되었습니다:

```txt
The Company designs, manufactures and markets smartphones, personal computers, tablets, wearables and accessories. The Company’s fiscal year is the 52- or 53-week period that ends on the last Saturday of September.
```

한글 번역:

```txt
회사는 스마트폰, 개인용 컴퓨터, 태블릿, 웨어러블 및 액세서리를 설계, 제조 및 판매합니다. 회사의 회계연도는 9월 마지막 토요일에 끝나는 52주 또는 53주 기간입니다.
```

BART는 2019년에 공개된 모델이지만, **매우 괜찮은 품질**을 보여주는 것을 확인할 수 있었습니다.

오히려 최근 공개된 Llama 2에 비해 **파라미터 수**가 훨씬 적어 **속도는 더 빠릅**니다.

무조건 최신 모델을 찾기보다는, **용도에 맞는 최적의 데이터셋**으로 훈련된 모델을 찾는 것이 **결과가 더 좋을 수 있다**는 것을 알게 되었습니다.

**정리: 모델만큼 데이터셋도 중요하다!**
