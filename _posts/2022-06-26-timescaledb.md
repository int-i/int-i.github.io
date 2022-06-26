---
title: "시간의 차이가 느껴지십니까? PostgreSQL에 시계열을 더한 TimescaleDB"
date: 2022-06-26
author: Astro36
category: sql
tags: [sql, database, rdbms, postgres, timescale, time_series]
thumbnail: /assets/posts/2022-06-26-timescaledb/thumbnail.jpg
---

[TimescaleDB](https://www.timescale.com/)는 **PostgreSQL을 기반**의 **오픈소스 시계열(Time-series) RDBMS**입니다.

**시계열 데이터베이스**(TSDB, Time-series Database)는 **시계열 데이터**를 처리하기 위해 최적화된 데이터베이스로, **실시간으로 쌓이는 대규모 데이터**들을 처리하기 위해 고안되었습니다.

**시계열 데이터**는 일정한 시간 동안 수집되어 시간 축에 의해 정렬될 수 있는 데이터입니다.

시계열 데이터의 **예시**로는, 현재 CPU 온도, 연도별 실업률, 주식 가격 등이 있습니다.

시계열 데이터를 **저장**하기 위해서는 [InfluxDB](https://www.influxdata.com/), [Prometheus](https://prometheus.io/) 등의 **시계열 데이터베이스**를 사용합니다.

**대부분**의 시계열 데이터는 **NoSQL** 형태이지만, **TimescaleDB**는 RDMS의 한 종류인 **PostgreSQL 확장**으로 만든 **RDMS 시계열 데이터베이스**입니다.

참고: [PostgreSQL extension 사용 방법](http://kimchki.blogspot.com/2017/09/postgresql-extension.html)

프로젝트에서 이미 **RDMS를 사용**하고 있다면, 기존의 **SQL 코드**를 재활용 할 수 있어 부담 없이 채택할 수 있습니다.

## 설치

Docker를 이용해 설치하는 방법이 가장 간단합니다.

`docker-compose.yml`:

```yml
services:
  db:
    image: timescale/timescaledb:latest-pg14
    environment:
      TZ: Asia/Seoul
      POSTGRES_DB: timescale
      POSTGRES_USER: timescale
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

> 주의: `timescale/timescaledb`는 `lastest` 태그가 없습니다.

사실상 **Docker로 PostgreSQL을 설치**하는 방법에서, 이미지만 **TimescaleDB로 교체**한 것입니다.

참고: [Docker Compose를 이용한 PostgreSQL 세팅! 근데 이제 Swarm Mode를 곁들인...](https://int-i.github.io/sql/2021-08-21/postgres-docker-compose/)

> `timescale/timescaledb-ha`는 [TimescaleDB Toolkit](https://github.com/timescale/timescaledb-toolkit)이 포함된 이미지로, [PostGIS](https://postgis.net/)(지리적 객체)와 [Patroni](https://patroni.readthedocs.io/en/latest/)(고가용성)을 지원합니다.
>
> 추가 기능 없이, 그냥 작은 이미지가 필요하다면 `timescale/timescaledb`을 사용하면 됩니다.

Docker Compose를 사용하지 않을 예정이라면, 아래와 같이 **명령어로 실행**할 수도 있습니다.

```txt
$ docker run -d --name timescaledb -p 5432:5432 -e POSTGRES_PASSWORD=password timescale/timescaledb:latest-pg14
```

## SQL

TimescaleDB에서는 **시계일 데이터를 저장하는 테이블**을 [Hypertable](https://docs.timescale.com/getting-started/latest/create-hypertable/)로 부릅니다.

```sql
CREATE TABLE stock_prices (
  time   TIMESTAMPTZ NOT NULL,
  symbol TEXT NOT NULL,
  price  DOUBLE PRECISION NULL,
  volume INT NULL
);

SELECT create_hypertable('stock_prices','time');
```

`create_hypertable`을 이용해 SQL 테이블을 **하이퍼테이블(Hypertable)로 변환**할 수 있습니다.

```sql
CREATE INDEX symbol_time_idx ON stock_prices (symbol, `time` DESC);
```

`create_hypertable`로 하이퍼테이블을 생성하면 `time` 열에 대한 **인덱스(Index)는 자동으로 생성**되지만, `time`과 다른 열이 함께 포함된 인덱스는 생성되지 않습니다.

위의 `CREATE INDEX symbol_time_idx` 예시의 경우, `symbol`과 `time`을 함께 검색하는 경우가 많을 것이라 **예상**되기 때문에 **멀티 칼럼 인덱스(Multicolumn Index)를 생성**해 줍니다.

참고: [PostgreSQL 인덱스와 멀티 컬럼 인덱스에 대해서](https://blog.aaronroh.org/133)

> ### 부연 설명
>
> `stock_prices` 테이블에는 해당 주식의 `symbol`과 가격, 시간이 **하나의 열**로 들어갑니다.
>
> 예를 들어 삼성전자(`symbol=005930`)의 `time=2022-06-24 13:00:00` 때의 가격을 **조회**하고 싶다면,
>
> `SELECT price FROM stock_prices WHERE symbol = '005930' AND time = '2022-06-24 13:00:00'` 형태로 SQL문이 작성될 것입니다.
>
> 이때, `symbol`과 `time`을 모두 사용해서 테이블의 **데이터를 조회**하고, 여기서 탐색 속도를 더 빠르게 하기 위해 **멀티 칼럼 인덱스(Multicolumn Index)를 생성**해 줍니다.

생성된 하이퍼테이블을 이용하는 한 가지 예로, **삼성전자의 주가 데이터의 이동 평균**을 구해보도록 하겠습니다

```sql
SELECT
  time,
  AVG(price) OVER(PARTITION BY symbol ORDER BY time ROWS BETWEEN 5 PRECEDING AND CURRENT ROW) avg5_price
FROM stock_prices
WHERE symbol = '005930'
ORDER BY time DESC;
```

참고: [PostgreSQL - Window Functions](https://www.postgresql.org/docs/current/tutorial-window.html)

## 고급 분석

시계열 데이터베이스라는 명칭에 걸맞게 시계열 데이터 분석을 위한 **여러 함수가 추가**되었습니다.

`time_bucket`은 PostgreSQL의 `date_trunc`와 유사하지만, **원하는 간격**으로 시간을 잘라낼 수 있습니다.

참고: [Postgresql date_trunc()함수](https://sas-study.tistory.com/177)

아래는 **5분 간격으로 데이터의 평균**을 구하는 예시입니다.

```sql
SELECT time_bucket('5 minutes', time) + '2.5 minutes'
  AS five_min, avg(cpu)
FROM metrics
GROUP BY five_min
ORDER BY five_min DESC LIMIT 10;
```

이 밖에 다양한 함수의 **사용 예시**는 아래 페이지를 참고하면 됩니다.

참고: [TimescaleDB - Advanced analytic queries](https://docs.timescale.com/timescaledb/latest/how-to-guides/query-data/advanced-analytic-queries/)
