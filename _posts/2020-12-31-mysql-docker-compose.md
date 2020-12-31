---
title: "Docker Compose로 MySQL/MariaDB 세팅하기"
date: 2020-12-31
author: Astro36
category: sql
tags: [sql, docker, compose, mysql, mariadb]
---

Docker Compose를 이용하면 복잡한 DB 설치와 세팅 과정을 파일 하나로 간략화 할 수 있습니다.

Docker와 Docker Compose가 설치되어 있어야 하며, 설치 후 아래와 같이 `docker-compose.yml`를 만들어줍니다.

`docker-compose.yml`:

```yml
version: "3"

services:
  db:
    image: mariadb:10
    ports:
      - 3306:3306
    volumes:
      - ./db/conf.d:/etc/mysql/conf.d
      - ./db/data:/var/lib/mysql
      - ./db/initdb.d:/docker-entrypoint-initdb.d
    env_file: .env
    environment:
      TZ: Asia/Seoul
    networks:
      - backend
    restart: always

networks:
  backend:
```

그리고 `docker-compose.yml`가 위치한 디렉터리에 `db`라는 이름의 빈 디렉터리를 만들고 `conf.d`, `data`, `initdb.d` 디렉터리를 생성해줍니다.

`conf.d`안에는 `my.cnf` 파일을 만들고 아래 내용을 채워줍니다.

`my.cnf`:

```txt
[client]
default-character-set = utf8mb4

[mysql]
default-character-set = utf8mb4

[mysqld]
character-set-client-handshake = FALSE
character-set-server           = utf8mb4
collation-server               = utf8mb4_unicode_ci
```

> utf8mb4는 이모지(emoji)를 지원하는 utf8이라 생각하시면 됩니다.

`initdb.d`에는 빈 `create_table.sql`과 `load_data.sql` 파일을 생성해 넣어줍니다.

마지막으로 DB에 대한 계정 정보가 있는 `.env` 파일을 만들어줍니다.

`.env`:

```txt
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=root!
MYSQL_DATABASE=students
MYSQL_USER=inti
MYSQL_PASSWORD=inti1234
```

> `.env`에는 DB에 접속할 수 있는 정보가 들어있기 때문에 외부로 유출되지 않게 주의해야 합니다.

결과적으로 디렉터리 구조는 아래와 같이 나옵니다.

```txt
- db
  - conf.d
    - my.cnf
  - data
    - ...
  - initdb.d
    - create_table.sql
    - load_data.sql
- docker-compose.yml
- .env
```

## docker-compose.yml

- `image: mariadb:10`는 MariaDB 10 이미지를 사용한다는 의미입니다.
- `ports:...`는 DB의 3306 포트를 열어준다는 의미입니다.
- `volumes:...`는 Docker 컨테이너의 파일을 사용자 시스템의 파일에 연결한다는 의미입니다.
- `TZ:...`는 DB의 시간대를 설정하는 용도입니다.

여기서 `/etc/mysql/conf.d`는 MySQL의 설정 파일이 위치하는 경로입니다.
MariaDB의 경우도 MySQL과 동일한 경로를 사용합니다.

`/var/lib/mysql`은 DB의 데이터가 파일 형태로 저장되는 공간입니다.

또한, 아래 `load_data.sql`에서 불러오는 파일 또한 이 디텍토리를 기준으로 불러옵니다.

`initdb.d`는 Docker 컨테이너가 최초 실행 시 불러올 스크립트가 위치하는 공간입니다.
주로 테이블 생성과 같은 스크립트가 위치하게 됩니다.
스크립트가 여러 개 있다면 파일 이름의 사전순서대로 실행됩니다.

참고: [Compose file version 3 reference](https://docs.docker.com/compose/compose-file/compose-file-v3/)

## create_table.sql

```sql
CREATE TABLE departments (
    `id`        INT          NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(25)  NOT NULL UNIQUE,
    `priority`  TINYINT      NOT NULL,
    PRIMARY KEY (id)
);
```

위와 같이 DB에 필요한 테이블 등을 정의하는 용도로 사용하면 됩니다.

## load_data.sql

```sql
LOAD DATA INFILE './departments.csv' INTO TABLE departments FIELDS TERMINATED BY ',' (`name`, `priority`);
```

DB 테이블에 미리 넣어둬야 할 정보가 있다면 `load_data.sql`을 이용해 데이터를 삽입해줍니다.

참고: [How to Quickly Insert Data Into MariaDB](https://mariadb.com/kb/en/how-to-quickly-insert-data-into-mariadb/)

구체적인 사용 사례는 [이 프로젝트](https://github.com/jolbon/jolbon-api)를 참고하시면 됩니다.
