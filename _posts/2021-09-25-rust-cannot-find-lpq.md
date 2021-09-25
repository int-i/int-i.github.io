---
title: "Rust: /usr/bin/ld: cannot find -lpq"
date: 2021-09-25
author: Astro36
category: rust
tags: [rust, postgres, linux, ubuntu]
thumbnail: /assets/posts/2021-09-25-rust-cannot-find-lpq/thumbnail.jpg
---

Rust의 [Diesel](http://diesel.rs/) 크레이트를 사용할 때, **Postgres** feature를 사용하면 아래 같은 오류가 발생하는 경우가 있습니다.

```txt
$ cargo run
Compiling diesel v1.4.8
Compiling rocket_sync_db_pools v0.1.0-rc.1
Compiling integer v0.1.0 (/home/ubuntu/projects/integer)
error: linking with `cc` failed: exit status: 1
|
= note: "cc" "/home/ubuntu/projects/proj/target/debug/deps/proj-4395121d495179f4.10v4c1slo2g386og.rcgu.o" ...
= note: /usr/bin/ld: cannot find -lpq
        collect2: error: ld returned 1 exit status
```

위 오류는 `libpq-dev` **패키지를 설치**하면 해결됩니다.

`libpq`는 [**PostgreSQL의 C 라이브러리**](https://www.postgresql.org/docs/current/libpq.html)입니다.

`*-dev`는 **헤더 파일** 등 프로그램을 링크하기 위한 코드를 포함하고 있는 라이브러리 패키지를 의미합니다.

참고: [What does the *-dev *-dbg and *-utils mean?](https://stackoverflow.com/a/19033644)

```txt
$ sudo apt-get install libpq-dev
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following additional packages will be installed:
  libpq5
Suggested packages:
  postgresql-doc-12
The following NEW packages will be installed:
  libpq-dev libpq5
0 upgraded, 2 newly installed, 0 to remove and 0 not upgraded.
Need to get 243 kB of archives.
After this operation, 990 kB of additional disk space will be used.
Get:1 http://ports.ubuntu.com/ubuntu-ports focal-updates/main arm64 libpq5 arm64 12.8-0ubuntu0.20.04.1 [110 kB]
Get:2 http://ports.ubuntu.com/ubuntu-ports focal-updates/main arm64 libpq-dev arm64 12.8-0ubuntu0.20.04.1 [133 kB]
Fetched 243 kB in 2s (156 kB/s)   
Selecting previously unselected package libpq5:arm64.
(Reading database ... 145038 files and directories currently installed.)
Preparing to unpack .../libpq5_12.8-0ubuntu0.20.04.1_arm64.deb ...
Unpacking libpq5:arm64 (12.8-0ubuntu0.20.04.1) ...
Selecting previously unselected package libpq-dev.
Preparing to unpack .../libpq-dev_12.8-0ubuntu0.20.04.1_arm64.deb ...
Unpacking libpq-dev (12.8-0ubuntu0.20.04.1) ...
Setting up libpq5:arm64 (12.8-0ubuntu0.20.04.1) ...
Setting up libpq-dev (12.8-0ubuntu0.20.04.1) ...
Processing triggers for libc-bin (2.31-0ubuntu9.2) ...
Processing triggers for man-db (2.9.1-1) ...
```
