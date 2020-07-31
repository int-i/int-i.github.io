---
title: "Windows 10에서 파이썬 패키지를 만들어 PyPI로 배포하기"
date: 2020-07-31
author: Astro36
category: python
tags: [python, package, deploy, pypi, setuptools, flake8, pytest, codecov, github, actions]
---

[PyPI](https://pypi.org/)는 "Python Package Index"라는 뜻으로 **파이썬 패키지**를 모아놓은 **저장소**입니다.

PyPI에 배포된 패키지는 `pip install` 명령을 이용해 **쉽게** 다운로드해 사용할 수 있습니다.

## 준비

파이썬 패키지 배포에 필요한 기본적인 코드는 [여기](https://github.com/int-i/python-starter)에 **템플릿**으로 올려놓았습니다.

이 글에서는 위 템플릿을 기준으로 설명을 할 예정이니 `git clone` 등을 이용해 템플릿을 **다운로드**해 줍니다.

[Git](https://git-scm.com/)을 이용해 다운로드:

```txt
$ git clone https://github.com/int-i/python-starter.git
```

## 패키지 정보 입력

템플릿의 [`setup.py`](https://github.com/int-i/python-starter/blob/master/setup.py)를 열어 패키지 정보를 입력해줍니다.

`setup` 함수의 각 인자에 대해서는 [Building and Distributing Packages with Setuptools](https://setuptools.readthedocs.io/en/latest/setuptools.html)을 참고하면 됩니다.

인자 중, `classifiers`는 [PyPI Classifiers](https://pypi.org/classifiers/)을 참고해 작성해야 합니다.

`python_requires` 인자의 경우 [PEP 345](https://www.python.org/dev/peps/pep-0345/#version-specifiers)를 참고해 작성합니다.

> `long_description` 인자는 PyPI의 패키지 정보 문서에 해당하는 내용입니다.
>
> Windows에서는 EOL로 CRLF(`'\r\n'`)를 사용하지만, 패키지 배포 도구는 이를 인식하지 못하기 때문에 LF(`'\n'`)로 바꿔줘야 합니다.
>
> 만약 CRLF를 사용하지 않는 환경이라면 `.replace('\r\n', '\n')`를 생략할 수 있습니다.

## 패키지 작성

`package_name` 폴더의 이름을 `setup.py`에서 설정한 패키지 이름으로 수정합니다.

`__init__.py`은 해당 폴더가 **패키지의 일부**임을 나타내는 파일입니다.
`__init__.py`이 없다면 파이썬에서 코드를 패키지로 인식하지 못합니다.

참고: [점프 투 파이썬 - 패키지](https://wikidocs.net/1418)

## 코드 테스트

`pytest` 명령을 이용해 `tests` 폴더의 테스트 코드를 실행할 수 있습니다.

[pytest](https://docs.pytest.org/) 설치:

```txt
$ pip install -U pytest
```

[pytest-cov](https://pytest-cov.readthedocs.io/)는 pytest에서 [코드 커버리지](https://lsjsj92.tistory.com/574)를 측정하는 모듈입니다.

pytest-cov 설치:

```txt
$ pip install -U pytest-cov
```

아래와 같이 `tests` 폴더의 코드를 이용해 코드 커버리지를 측정할 수 있습니다.

```txt
$ pytest --cov=package_name
```

측정 결과를 HTML 형태로 출력하려면 `--cov-report=html` 옵션을 달아주면 됩니다.

```txt
$ pytest --cov=package_name --cov-report=html
```

참고: [pytest-cov Reporting](https://pytest-cov.readthedocs.io/en/latest/reporting.html)

`.coveragerc`는 코드 커버리지를 측정할 때, 제외 폴더 등 측정 방식을 설정하는 파일입니다.

파일 설정 방법에 대해서는 [Coverage.py Configuration reference](https://coverage.readthedocs.io/en/coverage-5.2.1/config.html)를 참고해주세요.

## 배포

### `requirements.txt` 파일 생성

`requirements.txt`는 파이썬 **패키지의 의존성**을 설정하는 파일입니다.

`pip freeze` 명령을 통해 현재 컴퓨터에 설치된 의존성을 가져올 수 있습니다.

### `LICENSE` 파일 수정

현재 템플릿의 `LICENSE` 파일을 삭제해주시고 **본인 패키지의 라이선스**를 넣어주세요.

### 프로젝트 배포 패키지 생성

```txt
$ pip install --user --upgrade setuptools wheel
$ python ./setup.py sdist bdist_wheel
```

### 패키지 유효성 검사

```txt
$ pip install --user --upgrade twine
$ twine check dist/*
```

> 만약 코드에서 아래와 같은 오류가 발생한다면 '패키지 정보 입력'의 `long_description` 부분을 **다시 확인**해보세요.
>
> 패키지 배포 도구는 Windows의 CRLF를 인식하지 못합니다.
>
> ```txt
> Checking dist\kotka-0.1.0-py3-none-any.whl: PASSED, with warnings
>   warning: `long_description_content_type` missing. defaulting to `text/x-rst`.
> Checking dist\kotka-0.1.0.tar.gz: FAILED
>   `long_description` has syntax errors in markup and would not be rendered on PyPI.
>     line 53: Warning: Inline literal start-string without end-string.
>   warning: `long_description_content_type` missing. defaulting to `text/x-rst`.
> ```
>
> 참고: [setuptools (39.1.0) doesn't set up Description-Content-Type correctly on Windows](https://github.com/pypa/setuptools/issues/1440#issuecomment-569564497)

### PyPI에 배포

```txt
$ twine upload dist/*
```

[Test PyPI](https://test.pypi.org/)에 배포하기를 원하신다면 `--repository testpypi` 옵션을 주면 됩니다.

Test PyPI는 PyPI 계정과 별도로, **새로 가입**하셔야 사용할 수 있습니다.

참고: [Packaging Python Projects](https://packaging.python.org/tutorials/packaging-projects/)

## 기타: GitHub Workflow 설정

[GitHub Actions](https://github.com/features/actions)는 GitHub에서 제공하는 소프트웨어 개발 작업 자동화 서비스로 코드 테스트, 패키지 배포 등의 **반복적인 작업을 자동화**할 수 있습니다.

GitHub Actions는 **GitHub에서만 제공**하며 레포지토리 설정에서 Actions를 활성화해야 사용할 수 있습니다.

만약 GitHub를 사용하지 않는 경우 `.github` 폴더를 삭제하셔도 됩니다.

[`.github/workflows/python.yml`](https://github.com/int-i/python-starter/blob/master/.github/workflows/python.yml)은 GitHub Actions의 Workflow를 설정하는 파일입니다.

위 파일에는 [Flake8](https://flake8.pycqa.org/)을 이용한 [코드 린트](https://ko.wikipedia.org/wiki/린트_(소프트웨어)), [pytest](https://docs.pytest.org/)를 이용한 코드 테스트와 코드 커버리지 측정 작업이 설정되어 있습니다.

`python.yml`파일의 81번째 줄, `pytest --cov=package_name --cov-report=xml`의 `package_name`을 `setup.py`에서 설정한 **패키지 이름으로 수정**해야 합니다.
