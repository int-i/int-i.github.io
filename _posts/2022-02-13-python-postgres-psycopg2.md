---
title: "Python과 PostgreSQL 연동 -> Psycopg2"
date: 2022-02-13
author: Astro36
category: python
tags: [python, pypi, psycopg2, postgres, database, sql]
thumbnail: /assets/posts/2022-02-13-python-postgres-psycopg2/thumbnail.jpg
---

[Psycopg2](https://www.psycopg.org/docs/)은 **Pyhton**에서 사용되는 **PostgreSQL DB 어댑터**로, [Python DB API 2.0](https://www.python.org/dev/peps/pep-0249/) 사양을 완전히 구현했습니다.

[libpq](https://www.postgresql.org/docs/current/libpq.html) 위에서 동작하며, **멀티스레드** 프로그램에서 **스레드 안정성**을 가지고 효율적인 자원 관리가 가능합니다.

Psycopg2는 PyPI로 **설치** 가능합니다.

```txt
$ pip install psycopg2-binary
```

> `psycopg2-binary`는 Python과 PostgreSQL 빌드 **의존성 설치**가 필요하지 않은 패키지입니다.

설치가 끝나면 `connect` 함수를 이용해 **DB에 연결**합니다.

```py
import psycopg2

conn = psycopg2.connect(dbname='db', user='user', password='pw1234', host='localhost', port=5432)
cur = conn.cursor()

cur.close()
conn.close()
```

`host`의 기본값은 **UNIX 소켓**이며, `port`의 기본값은 `5432`입니다.

Python의 **`with` 문법**을 이용하면, `close` 함수 호출을 **생략**할 수 있습니다.

```py
with psycopg2.connect(dbname='db', user='user', password='pw1234', host='localhost', port=5432) as conn:
    with conn.cursor() as cur:
        # ...
```

참고: [파이썬 with 정리](https://pythondocs.net/uncategorized/%ED%8C%8C%EC%9D%B4%EC%8D%AC-with-%EC%A0%95%EB%A6%AC/)

`execute` 함수를 이용해서 **SQL을 실행**하고, `fetch`류의 함수를 이용해 **결과**를 가져올 수 있습니다.

```py
cur.execute('SELECT 1')
print(cur.fetchone()) # (1,)
```

- `fetchone`
- `fetchmany`
- `fetchall`

변수 값을 이용해 **SQL문을 생성**하는 경우에는 `%`을 이용해 값을 넣어줍니다.

```py
cur.execute("INSERT INTO num1 VALUES (%s)", (1,))
cur.execute("INSERT INTO num2 VALUES (%s, %s)", (10, 20))
```

> 필요한 값이 1개이더라도 `()`으로 **감싸**줘야 합니다.
>
> 이때 튜플 자료형이기 때문에 마지막 콤마(`,`)를 **생략**해서는 안 됩니다.

SQL을 이용해 **DB를 수정**한 이후에는 `commit` 함수를 호출해 **수정사항을 저장**해야 합니다.

```py
conn.commit()
```

만약 `with`문을 이용해서 **연결을 관리**하고 있다면, `with`가 **정상적으로 종료**되었을 때 **자동**으로 `commit`을 **호출**합니다.

참고: [Psycopg2 connection class - commit](https://www.psycopg.org/docs/connection.html#connection.commit)

`rollback` 함수는 반대로 **수정사항을 되돌리는** 함수입니다.

마찬가지로 `with`를 사용하는 중이라면, `with`에서 **오류가 발생**했을 때는 **자동**으로 `rollback` 함수를 **호출**합니다.

참고: [Python 으로 Postgresql 데이타베이스 연동 간단 리뷰](https://syncnet.tistory.com/m/entry/Python-%EC%9C%BC%EB%A1%9C-Postgresql-%EB%8D%B0%EC%9D%B4%ED%83%80%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EC%97%B0%EB%8F%99-%EA%B0%84%EB%8B%A8-%EB%A6%AC%EB%B7%B0)
