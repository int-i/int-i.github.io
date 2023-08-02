---
title: "Meta가 만든 최애의 AI! Windows에서 Llama 2를 실행하는 방법"
date: 2023-08-03
author: Astro36
category: python
tags: [python, ai, deep_learning, nlp, llm, llama, windows, meta, llama_cpp, cuda, langchain]
thumbnail: /assets/posts/2023-08-03-llama2-windows/thumbnail.jpg
---

[Llama 2](https://ai.meta.com/llama/)는 2023년 7월 18일에 [Meta에서 공개](https://about.fb.com/news/2023/07/llama-2/)한 **오픈소스 대규모 언어모델**입니다.

Llama 1 대비 40% 많은 **2조 개의 토큰** 데이터로 훈련되었으며, 추론, 코딩, 숙련도, 지식테스트 등 많은 벤치마크에서 다른 오픈소스 언어 모델보다 훌륭한 **성능**을 보여줍니다.

참고: [AlpacaEval Leaderboard](https://tatsu-lab.github.io/alpaca_eval/)

현재 Meta에서 직접 배포하는 Llama 모델은 **리눅스에서만 실행** 가능합니다.
그렇기에, Windows에서 Llama를 실행하려면 다른 방법을 찾아야 합니다.

## llama.cpp

[llama.cpp](https://github.com/ggerganov/llama.cpp)는 **4비트 정수 양자화**를 이용해서 **맥북**에서 **Llama 모델을 실행하는 것을 목표**로 만들어진 프로젝트입니다.

**의존성 없는** 순수 C/C++를 통해서 구현되었으며, Mac OS, **Windows**, Linux 모두 실행 가능합니다.

그래서 우리는 **llama.cpp**를 이용해 모델을 실행시킬 것입니다.

## CUDA

**모델이 GPU를 사용**하게 하려면, **CUDA**가 필요합니다.

CUDA는 **NVIDIA**가 만든 **GPU의 가상 명령어셋**을 사용할 수 있도록 만들어 주는 소프트웨어 레이어입니다.

CUDA는 최신버전을 사용해도 되지만 나중에 PyTorch 등을 사용하게 될 수도 있으므로,

**PyTorch 버전에 호환되는 CUDA 버전**을 다운로드 하는 것을 권장합니다.

> 2023년 7월 18일 기준, CUDA 11.7과 CUDA 11.8이 호환됩니다.
>
> 참고: [PyTorch - START LOCALLY](https://pytorch.org/get-started/locally/)

일반적으로 CUDA를 설치하게 되면 최신버전인 12로 설치되니,

[CUDA Toolkit 11.8 Downloads](https://developer.nvidia.com/cuda-11-8-0-download-archive)과 같이 버전 **아카이브에서 원하는 버전을 선택**하여 다운로드해야 합니다.

## Llama 2 GGML

[TheBloke/Llama-2-7B-GGML](https://huggingface.co/TheBloke/Llama-2-7B-GGML)에서 **양자화된 Llama 2 모델**을 다운로드 할 수 있습니다.

**채팅**에 특화된 모델이 필요하다면, [TheBloke/Llama-2-7B-Chat-GGML](https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGML)에서 다운로드 할 수 있습니다.

**7B**(=7 Billion)는 **모델의 크기**를 의미하며, **7B, 13B, 70B** 3종류가 있습니다.

고성능 GPU가 아니라면 7B 모델을 사용할 것을 권장드립니다.

모델의 양자화 기법은 크게 **GPTQ**과 **GGML** 2가지가 있습니다.

**양자화**를 통해서 **성능이 낮은 장치**에서도 모델을 실행할 수 있습니다.

그중 **GGML**은 **Apple M1 및 M2 실리콘에 최적화된 양자화 구현**입니다.

GGML은 GPTQ와 다르게, **GPU 없이도** 모델을 작동시킬 수 있다는 장점이 있습니다. 

참고: [ggml](https://github.com/ggerganov/ggml)

> GPTQ에 대한 자세한 설명은 아래 논문에 나와 있습니다.
> 
> 참고: [GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers](https://arxiv.org/abs/2210.17323)

파일명의 `q2_K`, `q3_K_L`, `q8_0` 등은 **양자화 레벨**입니다.

숫자가 작을수록 적은 비트를 사용하고, **모델의 용량**이 작습니다.

GPU의 성능이 낮을수록 작은 크기의 모델을 선택해야 합니다.

## llama-cpp-python

[llama-cpp-python](https://github.com/abetlen/llama-cpp-python)은 **llama.cpp**를 **파이썬 바인딩**(Python Binding)한 라이브러리입니다.

**파이썬 바인딩**이라는 말은, **C++ 함수를 파이썬에서** 쓸 수 있게 변환했다는 말입니다.

대부분의 NLP 라이브러리 등은 **파이썬**으로 작성되기 때문에, 우리는 `llama-cpp-python`를 이용해서 **Llama 동작 코드**를 작성할 것입니다.

**GPU**를 사용할 것이라면, `llama-cpp-python`를 설치하기 전에 아래와 같이 **환경변수**를 설정해야 합니다.

```txt
$env:CMAKE_ARGS = "-DLLAMA_CUBLAS=on"
$env:FORCE_CMAKE = 1
```

참고: [Windows Powershell Tip & Howto](https://www.lesstif.com/software-architect/windows-powershell-tip-howto-66715713.html)

그리고 `pip`로 `llama-cpp-python` **패키지를 설치**합니다.

```txt
pip install llama-cpp-python
```

아래와 같이 **Llama 2를 실행**해 볼 수 있습니다.

```python
from llama_cpp import Llama

llm = Llama(model_path="./llama-2-7b-chat.ggmlv3.q2_K.bin")

output = llm(
    "Question: What are the names of the planets in the solar system? Answer: ",
    max_tokens=32,
    stop=["Q:", "\n"],
    echo=True,
)
print(output)
```

```txt
ggml_init_cublas: found 1 CUDA devices:
  Device 0: NVIDIA GeForce RTX 2080 SUPER, compute capability 7.5
llama.cpp: loading model from ./llama-2-7b-chat.ggmlv3.q2_K.bin
llama_model_load_internal: format     = ggjt v3 (latest)
llama_model_load_internal: n_vocab    = 32000
llama_model_load_internal: n_ctx      = 512
llama_model_load_internal: n_embd     = 4096
llama_model_load_internal: n_mult     = 256
llama_model_load_internal: n_head     = 32
llama_model_load_internal: n_head_kv  = 32
llama_model_load_internal: n_layer    = 32
llama_model_load_internal: n_rot      = 128
llama_model_load_internal: n_gqa      = 1
llama_model_load_internal: rnorm_eps  = 1.0e-06
llama_model_load_internal: n_ff       = 11008
llama_model_load_internal: freq_base  = 10000.0
llama_model_load_internal: freq_scale = 1
llama_model_load_internal: ftype      = 10 (mostly Q2_K)
llama_model_load_internal: model size = 7B
llama_model_load_internal: ggml ctx size =    0.08 MB
llama_model_load_internal: using CUDA for GPU acceleration
llama_model_load_internal: mem required  = 3035.66 MB (+  256.00 MB per state)
llama_model_load_internal: offloading 0 repeating layers to GPU
llama_model_load_internal: offloaded 0/35 layers to GPU
llama_model_load_internal: total VRAM used: 288 MB
llama_new_context_with_model: kv self size  =  256.00 MB
AVX = 1 | AVX2 = 1 | AVX512 = 0 | AVX512_VBMI = 0 | AVX512_VNNI = 0 | FMA = 1 | NEON = 0 | ARM_FMA = 0 | F16C = 1 | FP16_VA = 0 | WASM_SIMD = 0 | BLAS = 1 | SSE3 = 1 | VSX = 0 | 

llama_print_timings:        load time =  1000.53 ms
llama_print_timings:      sample time =     0.39 ms /     3 runs   (    0.13 ms per token,  7633.59 tokens per second)
llama_print_timings: prompt eval time =  1000.50 ms /    19 tokens (   52.66 ms per token,    18.99 tokens per second)
llama_print_timings:        eval time =   151.38 ms /     2 runs   (   75.69 ms per token,    13.21 tokens per second)
llama_print_timings:       total time =  1155.79 ms
{'id': 'cmpl-68c73e87-ebbf-458e-95de-7dcd35b41c7e', 'object': 'text_completion', 'created': 1691003121, 'model': './llama-2-7b-chat.ggmlv3.q2_K.bin', 'choices': [{'text': 'Question: What are the names of the planets in the solar system? Answer: 1.', 'index': 0, 'logprobs': None, 'finish_reason': 'stop'}], 'usage': {'prompt_tokens': 19, 'completion_tokens': 3, 'total_tokens': 22}}
```

`BLAS = 1`이 표시되어야 **GPU가 사용**됩니다.

`BLAS = 0`이라면, **CPU만 사용**합니다.

모델이 너무 커서 **GPU의 메모리가 부족**하다면 `n_ctx` 크기를 줄여야 합니다.

`n_ctx`를 줄이게 되면, 한 번에 **모델에 넣을 수 있는 입력의 크기**가 줄어듭니다.

`n_batch`는 배치(Batch) 크기를 의미하며, `n_ctx`보다 작은 수를 넣어줘야 합니다.

참고: [Llama Parameters](https://abetlen.github.io/llama-cpp-python/#llama_cpp.llama.Llama.__init__)

해당 코드 동작에 사용한 GPU는 NVIDIA GeForce RTX 2080 SUPER입니다.

## LangChain

[LangChain](https://www.langchain.com/)은 **대규모 언어 모델**을 사용하여 애플리케이션 개발하기 위해 설계된 **프레임워크**입니다.

직접 `llama-cpp-python`를 `import`해서 사용해도 되지만, **LangChain**을 이용하면 LLM에 필요한 부가적인 도구를 함께 사용할 수 있습니다.

```python
from langchain.llms import LlamaCpp

llm = LlamaCpp(
    model_path="./llama-2-7b-chat.ggmlv3.q2_K.bin",
    n_ctx=512,
    n_batch=512,
    n_gpu_layers=35,
    verbose=True,
)

prompt = """
Question: What are the names of the planets in the solar system? Answer:
"""
print(llm(prompt))
```

```txt
ggml_init_cublas: found 1 CUDA devices:
  Device 0: NVIDIA GeForce RTX 2080 SUPER, compute capability 7.5
llama.cpp: loading model from ./llama-2-7b-chat.ggmlv3.q2_K.bin
llama_model_load_internal: format     = ggjt v3 (latest)
llama_model_load_internal: n_vocab    = 32000
llama_model_load_internal: n_ctx      = 512
llama_model_load_internal: n_embd     = 4096
llama_model_load_internal: n_mult     = 256
llama_model_load_internal: n_head     = 32
llama_model_load_internal: n_head_kv  = 32
llama_model_load_internal: n_layer    = 32
llama_model_load_internal: n_rot      = 128
llama_model_load_internal: n_gqa      = 1
llama_model_load_internal: rnorm_eps  = 1.0e-06
llama_model_load_internal: n_ff       = 11008
llama_model_load_internal: freq_base  = 10000.0
llama_model_load_internal: freq_scale = 1
llama_model_load_internal: ftype      = 10 (mostly Q2_K)
llama_model_load_internal: model size = 7B
llama_model_load_internal: ggml ctx size =    0.08 MB
llama_model_load_internal: using CUDA for GPU acceleration
llama_model_load_internal: mem required  =  343.10 MB (+  256.00 MB per state)
llama_model_load_internal: allocating batch_size x (512 kB + n_ctx x 128 B) = 288 MB VRAM for the scratch buffer
llama_model_load_internal: offloading 32 repeating layers to GPU
llama_model_load_internal: offloading non-repeating layers to GPU
llama_model_load_internal: offloading v cache to GPU
llama_model_load_internal: offloading k cache to GPU
llama_model_load_internal: offloaded 35/35 layers to GPU
llama_model_load_internal: total VRAM used: 3237 MB
llama_new_context_with_model: kv self size  =  256.00 MB
AVX = 1 | AVX2 = 1 | AVX512 = 0 | AVX512_VBMI = 0 | AVX512_VNNI = 0 | FMA = 1 | NEON = 0 | ARM_FMA = 0 | F16C = 1 | FP16_VA = 0 | WASM_SIMD = 0 | BLAS = 1 | SSE3 = 1 | VSX = 0 | 

llama_print_timings:        load time =   223.09 ms
llama_print_timings:      sample time =    11.51 ms /    91 runs   (    0.13 ms per token,  7904.79 tokens per second)
llama_print_timings: prompt eval time =   223.04 ms /    21 tokens (   10.62 ms per token,    94.15 tokens per second)
llama_print_timings:        eval time =  1263.36 ms /    90 runs   (   14.04 ms per token,    71.24 tokens per second)
llama_print_timings:       total time =  1601.97 ms

The eight planets in our solar system, listed in order from closest to farthest from the Sun are:

1. Mercury
2. Venus
3. Earth
4. Mars
5. Jupiter
6. Saturn
7. Uranus
8. Neptune

Note: Pluto is no longer considered a planet, but is now classified as a dwarf planet.
```

참고: [LangChain - Llama-cpp](https://python.langchain.com/docs/integrations/llms/llamacpp)

LangChain에서 **GPU를 사용**하게 하려면, 추가로 `n_gpu_layers` 값을 넣어야 합니다.

`llama-cpp-python`과 다르게, 기본값이 `None`이라 값을 지정하지 않으면 GPU를 사용하지 않습니다.

`n_gpu_layers`에는 적당히 큰 수를 넣으면,

```txt
llama_model_load_internal: offloaded 35/35 layers to GPU
```

와 같이, **GPU에서 최대로 사용할 수 있는 레이어**가 몇 개인지 알려줍니다.

`n_ctx`와 `n_batch`는 전과 동일하게, **입력의 크기와 GPU의 메모리를 고려**하여 지정합니다.

참고: [LlamaCpp Parameters](https://api.python.langchain.com/en/latest/llms/langchain.llms.llamacpp.LlamaCpp.html)
