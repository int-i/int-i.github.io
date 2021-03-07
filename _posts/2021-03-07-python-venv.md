---
title: "Python 가상환경 사용방법"
date: 2021-03-07
author: Astro36
category: python
tags: [python, pypi, venv]
---

파이썬에서 가상환경을 만들기 위해서는 `venv`와 `virtualenv`를 사용할 수 있습니다.

파이썬 3.3이상에서는 `venv`를 사용할 것을 추천하며, 파이썬 2 이하에서는 `virtualenv`를 사용할 수 있습니다.

파이썬 응용 프로그램은 종종 표준 라이브러리의 일부로 제공되지 않는 패키지와 모듈을 사용하는데, 추가적인 패키지 설치에 요구 사항 충돌이 발생할 수 있기 때문에 현재 시스템과 격리된 환경(가상환경)을 만들어 이를 해결합니다.

가상 환경을 만들려면, 원하는 디렉터리에서 venv 모듈을 실행합니다.

```txt
$ python3 -m venv .venv
```

위 명령어를 통해 현재 디렉토리에 `.venv` 가상환경을 생성할 수 있습니다.

그 후 아래와 같이 생성한 가상환경을 실행해줍니다.

```txt
$ source .venv/bin/activate
```

윈도우에서는 아래와 같이 실행할 수 있습니다.

```txt
$ source .venv\Scripts\activate.bat
```

가상환경이 실행되면 아래와 같이 현재 쉘이 가상환경에서 실행되고 있다고 표시됩니다.

```txt
(.venv) $
```

파이썬 버전 확인을 통해 가상환경이 정상적으로 실행되고 있음을 확인할 수 있습니다.

```txt
(.venv) $ python --version
Python 3.8.5
(.venv) $ pip --version
pip 20.0.2 from /home/../../.venv/lib/python3.8/site-packages/pip (python 3.8)
```
