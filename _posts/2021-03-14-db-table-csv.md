---
title: "DB 테이블에 저장된 데이터를 CSV로 변환하는 SQL"
date: 2021-03-14
author: Astro36
category: sql
tags: [sql, mysql, mariadb, database, export, import]
---

## DB -> CSV

DB 테이블에 저장된 데이터를 CSV로 변환에 출력하는 SQL 코드이다.

```sql
SELECT `field1`, `field2`, `field3` INTO OUTFILE './filename.csv'
    FIELDS
        TERMINATED BY ','
        OPTIONALLY ENCLOSED BY '"'
    FROM table_name;
```

파일은 `/var/lib/mysql/`에 저장되며, 기본 개행 문자는 `\n`(LF)이다.

CRLF로 바꾸려면 `LINES TERMINATED BY '\r\n'`을 `FIELDS` 구문 아래에 추가하면 된다.

참고: [MariaDB - SELECT INTO OUTFILE](https://mariadb.com/kb/en/select-into-outfile/)

## CSV -> DB

CSV 데이터를 DB 테이블에 삽입하는 SQL 코드이다.

```sql
LOAD DATA INFILE './filename.csv'
    INTO TABLE table_name
    FIELDS
        TERMINATED BY ','
        OPTIONALLY ENCLOSED BY '"'
    (`field1`, `field2`, `field3`);
```

마찬가지로 기본 개행 문자는 LF이며, 위 경우와 동일한 방법으로 개행 문자를 바꿀 수 있다.

참고: [MariaDB - LOAD DATA INFILE](https://mariadb.com/kb/en/load-data-infile/)
