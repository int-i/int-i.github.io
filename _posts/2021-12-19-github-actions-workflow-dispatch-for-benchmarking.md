---
title: "GitHub Actions와 workflow_dispatch: GitHub 오시면 공짜로 벤치마크 돌리는 법 다 있음"
date: 2021-12-19
author: Astro36
category: github
tags: [github, actions, workflow_dispatch, artifact, git, benchmark]
thumbnail: /assets/posts/2021-12-19-github-actions-workflow-dispatch-for-benchmarking/thumbnail.jpg
---

[GitHub Actions](https://github.com/features/actions)는 GitHub에서 제공하는 **CI/CD 도구**로, [`workflow_dispatch`](https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#workflow_dispatch) 이벤트를 이용하면 사용자가 **수동으로 워크플로우(Workflow)를 실행** 할 수 있습니다.

GitHub Actions를 이용해 알고리즘 벤치마크를 수행하면, 어디서든 **동일한 환경에서 성능 측정**을 할 수 있고, **알고리즘 벤치마크 과정이 전부 공개**되어 조작이 불가능하기 때문에 **결과의 신뢰도**가 높아지는 장점이 있습니다.

## 워크플로우 실행

`workflow_dispatch`는 GitHub 워크플로우 파일의 **트리거(Trigger)로 추가**해 사용합니다.

```yml
on: workflow
```

**매개변수(Parameter)와 함께 워크플로우를 실행**할 때는 아래 코드처럼 `inputs`를 이용합니다.

```yml
on:
  workflow_dispatch:
    inputs:
      name:
        description: 'Person to greet'
        required: true
        default: 'Mona the Octocat'
```

![Screenshot](/assets/posts/2021-12-19-github-actions-workflow-dispatch-for-benchmarking/screenshot.jpg)

워크플로우 파일이 GitHub에 올라가면, 위 스크린샷처럼 Actions 탭에 워크플로우를 **수동으로 실행**하는 버튼이 생깁니다.

## 벤치마크 업로드

워크플로우에서 생성된 **벤치마크 실행 결과**는 [Artifact](https://docs.github.com/en/actions/advanced-guides/storing-workflow-data-as-artifacts)나 [GitHub Actions for GitHub Pages](https://github.com/peaceiris/actions-gh-pages)를 이용해 **업로드**하면 됩니다.

**Artifact**로 결과를 업로드 하는 경우, [Upload-Artifact](https://github.com/actions/upload-artifact)를 사용할 수 있습니다.

```yml
uses: actions/upload-artifact@v2
with:
  name: benchmark
  path: benchmark/result.txt
```

**GitHub Actions for GitHub Pages**를 사용할 때는 아래와 같이 작성합니다.

```yml
uses: peaceiris/actions-gh-pages@v3
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  publish_dir: benchmark
```

> `secrets.GITHUB_TOKEN`는 Personal Access Token이 아닌, GitHub Actions에서 **자동으로 생성**되는 시크릿(Secret)입니다.
> 따라서 `secrets.GITHUB_TOKEN` 값을 설정할 필요없이, **그대로 사용**하면 됩니다.
>
> 참고: [Automatic token authentication](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)

물론, 외부 Actions를 사용하지 않고 **Git CLI를 이용해 직접 업로드**하는 방법도 있습니다.

```yml
run: |
  git config user.email "email@example.com"
  git config user.name "Your Name"
  git add benchmark/result.txt
  git commit -m "Update benchmark result"
  git push
```

다만, 이 경우에는 업로드 과정이 복잡해질수록 워크플로우 파일 관리가 어려워지기 때문에, **Actions 이용을 권장**합니다.
