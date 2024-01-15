---
title: "너도 Typst를 쓰지 않겠나? GitHub Actions로 Typst 파일 컴파일"
date: 2024-01-16
author: Astro36
category: github
tags: [github, actions, pages, typst, pdf, git]
thumbnail: /assets/posts/2024-01-16-typst-github-actions/thumbnail.png
---

[Typst](https://typst.app/)는 **공식문서 작성**을 더욱 효율적으로 만들어주는 도구입니다.

**LaTeX**와 유사하게도, 자체적인 **마크업 언어**를 사용하여 문서를 작성하며 마크업 문법이 더 **직관적**이기 때문에 배우기 쉽다는 장점이 있습니다.

미리 만들어진 **템플릿**을 사용하여 더욱 쉽게 문서를 작성할 수 있으며 **오픈소스** 프로젝트입니다.

참고: [Writing in Typst - Tutorial](https://typst.app/docs/tutorial/writing-in-typst/)

예시: [Typst로 작성한 Academic CV](https://github.com/Astro36/Astro36/blob/main/CV_Park.typ)

Typst는 웹 기반의 도구뿐만 아니라 **CLI 기반의 도구**도 있습니다.

```txt
typst compile file.typ
```

참고: [Installation - Typst](https://github.com/typst/typst?tab=readme-ov-file#installation)

## GitHub Actions

**GitHub Actions**는 **GitHub**에서 제공하는 **CI**(Continuous Integration)와 **CD**(Continuous Deployment)를 위한 서비스입니다.

참고: [워크서버개발팀의 GitHub Actions 적용기](https://tech.kakaoenterprise.com/180)

![pages](/assets/posts/2024-01-16-typst-github-actions/pages.png)

먼저, **Repository 설정**으로 가서 **Pages의 Source**를 GitHub Actions로 설정합니다.

참고: [사용자 지정 GitHub Actions 워크플로를 사용하여 GitHub Pages 사이트에 게시](https://docs.github.com/ko/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%A7%80%EC%A0%95-github-actions-%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%EA%B2%8C%EC%8B%9C)

![template](/assets/posts/2024-01-16-typst-github-actions/template.png)

GitHub에서는 다양한 **Workflow 템플릿**을 제공합니다.

**Typst 출력물**을 업로드하기 위한 `Static HTML` 템플릿을 선택합니다.

```yml
# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload entire repository
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

파일을 **업로드**하는 기능은 이미 구현되어 있기 때문에, `.typ`파일을 **컴파일**하는 코드만 넣어주면 됩니다.

```yml
- name: Checkout
  uses: actions/checkout@v4
- name: Setup Typst
  uses: typst-community/setup-typst@v3
```

`Checkout` 밑에 `Setup Typst` step을 넣어줍니다. **Typst를 설치**하는 코드입니다.

```yml
- name: Render PDF
  run: |
    mkdir -p dist
    typst compile filename.typ dist/filename.pdf
```

그 밑에 `.typ` 파일을 **컴파일**하는 step을 넣어줍니다.

컴파일된 pdf 파일은 `./dist` 디렉토리에 **저장**됩니다.

> `mkdir -p`는 해당 디렉토리가 **존재하지 않으면 디렉토리를 생성**하는 명령입니다.

```yml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist'
```

아래 `Upload artifact`의 `path`를 `.`에서 `./dist`로 바꿔줍니다.

이러면 `./dist` **디렉토리 내의 파일만 업로드**하게 됩니다.

### (부록) Times New Roman 설치

**Times New Roman**은 세리프 글꼴로, 1931년에 스탠리 모리슨(Stanley Morison)이 **The Times 신문**을 위해 디자인한 글꼴입니다.

**범용성**이 매우 높은 글꼴이며, 특히, **영어 논문** 작성 시에는 Times New Roman 글꼴을 사용하는 것이 일반적입니다.

**GitHub Actions**의 가상 환경에는 **Times New Roman** 글꼴이 설치되어 있지 않기 때문에, 해당 글꼴을 사용하려면 **별도의 설치**가 필요합니다.

```yml
- name: Install Font
  run: |
    sudo add-apt-repository multiverse
    sudo apt-get update
    echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | sudo debconf-set-selections
    sudo apt-get install ttf-mscorefonts-installer
    sudo fc-cache -rv
```

`ttf-mscorefonts-installer` **패키지를 설치**하고 **폰트 캐시를 강제로 재생성**하도록 합니다.

참고: [How To Install Times New Roman Font in Ubuntu](https://peakd.com/hive-163521/@macchiata/how-to-install-times-new-roman-font-in-ubuntu)
