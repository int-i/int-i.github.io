---
title: "Docker Compose를 이용한 PostgreSQL 세팅! 근데 이제 Swarm Mode를 곁들인..."
date: 2021-08-21
author: Astro36
category: sql
tags: [sql, docker, compose, stack, swarm, postgres]
thumbnail: /assets/posts/2021-08-21-postgres-docker-compose/thumbnail.jpg
---

[PostgreSQL](https://www.postgresql.org/)은 **객체-관계형 데이터베이스 시스템**으로, 전 세계 사용률은 상위 3개의 DB(Oracle DB, MySQL, Microsoft SQL)에 이어 4위로, 꾸준히 상승하고 있는 RDBMS입니다.

MySQL에 비해 **SQL 표준**을 더 많이 지원하며 **쿼리가 복잡**할수록 성능이 더 잘 나온다는 특징이 있습니다.

데이터베이스답게 설치가 복잡한 편이지만,

Docker Compose를 이용해 세팅 파일을 만들어두면 **명령어 한 줄**로 필요할 때마다 데이터베이스를 만들어 사용할 수 있습니다.

PostgreSQL 대신 MySQL/MariaDB가 필요하다면, [Docker Compose로 MySQL/MariaDB 세팅하기](https://int-i.github.io/sql/2020-12-31/mysql-docker-compose/)를 확인해주세요.

## Docker Compose

`docker-compose.yml`:

```yml
version: "3.9"

services:
  db:
    image: postgres:13-alpine
    deploy:
      placement:
        constraints:
          - node.role==manager
        max_replicas_per_node: 1
    environment:
      TZ: Asia/Seoul
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
    networks:
      - backend
    ports:
      - "5432:5432"
    restart: unless-stopped
    secrets:
      - db_password
    volumes:
      - ./db/initdb.d:/docker-entrypoint-initdb.d:ro
      - db_data:/var/lib/postgresql/data

networks:
  backend:

secrets:
  db_password:
    file: ./db/password.txt

volumes:
  db_data:
```

`image: postgres:13-alpine`은 PostgreSQL 이미지를 설정하는 부분입니다.

`-alpine` 이미지는 Debian 기반의 이미지(110MB)보다 용량이 작기(70MB) 때문에 호스트의 **저장용량 부담**을 줄이기 위해 선택했습니다.

`healthcheck`는 `pg_isready`를 이용해 해당 데이터베이스가 사용가능한 지 확인합니다.

상태를 확인하는 주기의 기본값은 30초입니다.

참고: [Docker - HEALTHCHECK](https://docs.docker.com/engine/reference/builder/#healthcheck)

> `pg_isready`에 `-U` 옵션으로 사용자를 지정하지 않으면, `FATAL: role "root" does not exist` 오류가 발생합니다.
>
> 참고: [PostgreSQL - pg_isready](https://www.postgresql.org/docs/current/app-pg-isready.html)

`restart: unless-stopped`를 통해 오류로 인해 **DB가 강제종료**되면, DB를 **재시작** 합니다.

`secrets`은 비밀번호와 같은 **민감한 데이터를 다루기 위해** 사용하며, `/run/secrets/*`를 통해 접근할 수 있습니다.

> [Docker Secret](https://docs.docker.com/engine/swarm/secrets/)은 파일 형식으로 접근하기 때문에 `POSTGRES_PASSWORD_FILE`을 이용해 DB의 비밀번호를 설정합니다.
>
> Secret을 사용하지 않고 환경변수에 직접 비밀번호를 넘기려면, `POSTGRES_PASSWORD`를 이용해주세요.

참고: [[Docker] Secret 사용 해보기](https://yongho1037.tistory.com/m/808)

`volumes`은 **실질적인 데이터**가 저장되는 부분입니다.

`./db/initdb.d`은 DB가 처음 실행될 때, **초기화에 필요한 SQL 파일**들을 모아놓는 디렉토리입니다

해당 디렉토리의 `*.sql`, `*.sql.gz`, `*.sh` 파일은 파일 이름을 **사전순으로 정렬**해 순차적으로 실행됩니다.

`docker-compose.yml` 파일을 만들었다면, `docker-compose up` 명령을 통해 실행할 수 있습니다.

이때 `-d` 옵션을 붙이면, 백그라운드 모드로 실행됩니다.

## Docker Stack

Docker Stack은 Compose를 더 확장한 개념으로, Docker Swarm을 통해 **여러 대의 컴퓨터**를 **하나의 컴퓨터**처럼 묶어 사용할 수 있습니다.

참고: [[Docker] docker-compose docker stack 차이](https://log-laboratory.tistory.com/m/191)

참고: [Docker Swarm 을 이용한 Container Orchestration 환경 만들기](https://tech.osci.kr/2019/02/13/59736201/)

`deploy`은 Docker Stack에서만 실행되는 옵션입니다.

Docker Swarm에는 매니저(Manager) 노드와 워커(Worker)노드가 있는데, `constraints`를 통해 어느 노드에 서비스를 배포할 지 결정할 수 있습니다.

`node.role==manager`로 매니저 노드에만 DB가 배포되게 설정합니다.

`max_replicas_per_node`는 한 노드에 몇 개의 서비스를 배포할 지 결정합니다.

기본 값은 무제한으로, 일반적으로 DB는 하나면 충분하므로 1로 설정했습니다.

> 여기서 노드(Node)는 **Docker Swarm에 속한 서버의 단위**로, 보통 한 컴퓨터에 하나의 도커 데몬만 실행하므로 `노드=컴퓨터`로 이해하셔도 됩니다.
>
> 참고: [Docker Swarm을 이용한 쉽고 빠른 분산 서버 관리](https://subicura.com/2017/02/25/container-orchestration-with-docker-swarm.html)

Docker Stack에선 위에서 설정한 `restart` **옵션이 무시**되는데, 그렇다고 Stack을 위한 또 다른 재시작 옵션을 추가할 필요는 없습니다.

Stack에서는 `restart_policy.condition`를 통해 **재시작 여부**를 결정하는데, 기본값은 `any`로 **서비스가 종료되면 항상 재시작**합니다.

> `restart`의 기본값은 `none`입니다.

Docker Stack으로 서비스를 만들 때는 아래 명령을 이용합니다.

```txt
$ docker swarm init
$ docker stack deploy -c docker-compose.yml stack_name
```

참고: [docker stack deploy](https://docs.docker.com/engine/reference/commandline/stack_deploy/)
