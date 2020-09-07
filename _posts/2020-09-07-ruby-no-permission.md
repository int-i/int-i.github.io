---
title: "Ruby: You don't have write permissions for the /var/lib/gems/2.7.0 directory."
date: 2020-09-07
author: Astro36
category: linux
tags: [github, jekyll, ruby, gem, linux, ubuntu]
---

```txt
$ sudo apt-get install ruby-full
```

Ruby를 처음 설치하고 `gem update`를 하면 `Ruby: You don't have write permissions for the /var/lib/gems/2.7.0 directory.`와 같이 권한이 없다면서 실행을 거부한다.

`sudo gem update`을 입력하면 당장의 문제는 해결이 되지만 좋은 방법은 아니다.

아래와 같이 환경변수를 추가하면 문제가 해결된다.

```txt
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

위 스크립트를 복사해 명령창에 실행시킨다.

```txt
$ gem update
$ gem install jekyll bundler
```

환경변수 설정이 끝나면 `update`와 `install` 모두 잘 된다.
