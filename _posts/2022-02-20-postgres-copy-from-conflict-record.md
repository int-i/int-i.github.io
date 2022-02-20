---
title: "PostgreSQL COPY FROM 레코드 충돌 해결법: TEMPORARY TABLE과 ON CONFLICT"
date: 2022-02-20
author: Astro36
category: sql
tags: [sql, postgres, database, import, copy_from, temporary_table, insert, on_conflict]
thumbnail: /assets/posts/2022-02-20-postgres-copy-from-conflict-record/thumbnail.jpg
---

`COPY FROM`은 외부 **파일**을 읽어 PostgreSQL **테이블**에 **옮기는** SQL 명령어입니다.

```sql
COPY table FROM file;
```

`COPY FROM`은 `INSERT`에 비해 **빠르게 동작**하기 때문에 **대용량의 파일**을 읽어와야 할 때 주로 사용합니다.

하지만, `COPY FROM`는 파일에 **중복된 레코드**(Record) 등 테이블 **제약조건**(Constraint)에 맞지 않는 레코드가 있으면 **오류**를 생성하며 종료됩니다.

사전에 파일 내 데이터를 잘 확인하면 문제가 발생하지 않지만, 불가피하게 **대량의 불완전한 데이터**를 입력해야 할 경우에는 상당히 곤란한 상황이 발생합니다.

`COPY FROM`과 달리, `INSERT` 명령에는 `ON CONFLICT`를 통해 Unique Violation 등 **충돌 발생** 시 **대응 방법을 지정**할 수 있기에, 이것을 잘 조합하면 **충돌을 무시**하는 `COPY FROM`를 구현할 수 있습니다.

```sql
CREATE TEMPORARY TABLE tmp_table (LIKE table) ON COMMIT DROP;

COPY tmp_table FROM file;

INSERT INTO table SELECT * FROM tmp_table ON CONFLICT DO NOTHING;
```

먼저 `CREATE TEMPORARY TABLE`을 이용해 **임시 테이블**을 만듭니다.

그리고 `COPY FROM`으로 **임시 테이블**에 데이터를 **전달**합니다.

임시 테이블은 **비어있는 상태**로 생성되기 때문에, 기존의 데이터와 충돌하는 상황이 생기지 않습니다.

> 기존 테이블의 **제약조건도 복사**해야 할 때는 `INCLUDING` 기능을 이용해 **임시 테이블을 생성**할 수 있습니다.
>
> ```sql
> CREATE TEMPORARY TABLE tmp_table (LIKE table INCLUDING ALL) ON COMMIT DROP;
> ```

`INSERT` 명령을 이용해 임시 테이블의 데이터를 **원래 테이블로 이동**시킵니다.

이때, `ON CONFLICT`를 이용해 **충돌 시 대응 방법**을 지정합니다.

`DO NOTHING`은 문제가 발생한 **레코드를 무시**하는 옵션입니다.

**Upsert** 기능이 필요한 경우, `DO UPDATE SET`을 이용하면 됩니다.

```sql
INSERT INTO table SELECT * FROM tmp_table ON CONFLICT DO UPDATE SET field = EXCLUDED.field;
```

> `EXCLUDED`는 **문제의 레코드**를 의미합니다.

참고: [How Postgresql COPY TO STDIN With CSV do on conflic do update?](https://stackoverflow.com/questions/48019381/how-postgresql-copy-to-stdin-with-csv-do-on-conflic-do-update)

참고: [PostgreSQL INSERT](https://www.postgresql.org/docs/current/sql-insert.html)
