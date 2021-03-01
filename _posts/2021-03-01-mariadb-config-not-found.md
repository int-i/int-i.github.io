---
title: "Python: OSError: mariadb_config not found."
date: 2021-03-01
author: Astro36
category: python
tags: [python, pip, mariadb, database]
---

```txt
$ pip install mariadb
...
OSError: mariadb_config not found.

Please make sure, that MariaDB Connector/C is installed on your system.
Either set the environment variable MARIADB_CONFIG or edit the configuration
file 'site.cfg' and set the 'mariadb_config option, which should point
to the mariadb_config utility.
The MariaDB Download website at <https://downloads.mariadb.com/Connectors/c/>
provides latest stable releease of Connector/C.
```

위 오류는 `mariadb` 패키지 요구사항을 제대로 충족시키지 않았을 때 발생합니다.

`mariadb` 패키지 설치 요구사항은 아래와 같습니다.

- C 컴파일러
- 파이썬 개발 패키지 (`python-dev`)
- **MariaDB Connector/C 라이브러리 및 헤더 파일**
- TLS 라이브러리 (ex. OpenSSL 등)

참고: [MariaDB Connector/Python Prerequisites](https://mariadb-corporation.github.io/mariadb-connector-python/install.html#prerequisites)

```txt
$ sudo apt install libmariadb-dev
```

MariaDB 개발 패키지의 라이브러리와 헤더 파일을 설치하면 `mariadb` 라이브러리가 정상적으로 설치됩니다.
