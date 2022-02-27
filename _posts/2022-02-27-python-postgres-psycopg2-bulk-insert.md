---
title: "Psycopg2.extras를 이용한 Bulk Insert: executemany로 성능 절반 손해봤어어!"
date: 2022-02-27
author: Astro36
category: python
tags: [python, pypi, psycopg2, postgres, database, sql, bulk, insert]
thumbnail: /assets/posts/2022-02-27-python-postgres-psycopg2-bulk-insert/thumbnail.jpg
---

Python에서는 Psycopg2를 이용해 **PostgreSQL** DB에 접근할 수 있습니다.

참고: [Python과 PostgreSQL 연동 -> Psycopg2](https://int-i.github.io/python/2022-02-13/python-postgres-psycopg2/)

**대량의 데이터를 삽입**할 때는 [`COPY`를 사용](https://int-i.github.io/sql/2022-02-20/postgres-copy-from-conflict-record/)하는 것이 권장되지만, 상황에 따라서 반드시 `INSERT`를 사용해야 할 때도 있습니다.

단순히 [`executemany`](https://www.psycopg.org/docs/cursor.html#cursor.executemany)를 이용해 `INSERT`를 수행하는 것은 **좋지 못한** 선택인데,

Psycopg2의 `executemany`는 `for` 반복문을 이용해 [`execute`](https://www.psycopg.org/docs/cursor.html#cursor.execute)를 **반복 실행**하는 원리이기 때문에 **대량의 데이터를 삽입**해야 할 때 성능 크게 저하됩니다.

이 경우에는, SQL문의 **반복 실행에 최적화**된 [`execute_batch`](https://www.psycopg.org/docs/extras.html#psycopg2.extras.execute_batch)와 [`execute_values`](https://www.psycopg.org/docs/extras.html#psycopg2.extras.execute_values)를 이용하면 조금이라도 동작을 **빠르게** 할 수 있습니다.

`execute_batch`는 `executemany`와 비슷하지만, 주어진 SQL을 **하나의 SQL로 묶어** 한 번에 전송합니다.

```py
import psycopg2.extras

sql = 'INSERT INTO simple_table (a, b, c) VALUES (%s, %s, %s);'
argslist = [(1, 2, 3), (10, 20, 30), (100, 200, 300)]
psycopg2.extras.execute_batch(cur, sql, argslist)
```

위 코드의 SQL은 아래와 같이 **합쳐**져 한 번에 전송됩니다.

```sql
INSERT INTO simple_table (a, b, c) VALUES (1, 2, 3);
INSERT INTO simple_table (a, b, c) VALUES (10, 20, 30);
INSERT INTO simple_table (a, b, c) VALUES (100, 200, 300);
```

하지만 여기서도 **비효율적**인 점을 찾을 수 있는데,

`INSERT`는 자체적으로 **여러 개의 값**을 `,`로 이어 **한꺼번에 삽입**하는 기능을 지원하기 때문입니다.

`execute_values`는 이 점을 적극적으로 활용하는 함수로, `VALUES` 부분만 **복사**해서 이어줍니다.

```py
import psycopg2.extras

sql = 'INSERT INTO simple_table (a, b, c) VALUES %s;'
argslist = [(1, 2, 3), (10, 20, 30), (100, 200, 300)]
psycopg2.extras.execute_values(cur, sql, argslist)
```

위 코드의 SQL은 아래와 같이 **변형**됩니다.

```sql
INSERT INTO simple_table (a, b, c) VALUES (1, 2, 3), (10, 20, 30), (100, 200, 300);
```

`execute_values`의 4번째 인자로 `template`을 받을 수 있는데, 이것은 **입력되는 값의 갯수**만큼 **자동으로 생성**되는 값입니다.

위 코드의 `template`은 `(%s, %s, %s)`으로 **자동 생성**되었을 것입니다.

`INSERT` 내부에서 `SELECT` 등의 **쿼리 중첩**이 필요하다면, `template`을 직접 정의할 수도 있습니다.

```py
import psycopg2.extras

sql = 'INSERT INTO simple_table (a, b, c) VALUES %s;'
argslist = [(1, 2, 3), (10, 20, 30), (100, 200, 300)]
template = '((SELECT id FROM num_table WHERE number = %s), %s, %s)'
psycopg2.extras.execute_values(cur, sql, argslist, template)
```
위 코드의 SQL은 아래와 같이 **변형**됩니다.

```sql
INSERT INTO simple_table (a, b, c) VALUES
    ((SELECT id FROM num_table WHERE number = 1), 2, 3),
    ((SELECT id FROM num_table WHERE number = 10), 20, 30),
    ((SELECT id FROM num_table WHERE number = 100), 200, 300);
```
