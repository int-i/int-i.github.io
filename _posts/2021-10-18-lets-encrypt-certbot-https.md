---
title: "듣고있나요 나의 이 모든 패킷을: certbot과 함께하는 HTTPS 적용 (Feat. HAProxy)"
date: 2021-10-18
author: Astro36
category: web
tags: [linux, lets_encrypt, certbot, https, hsts, haproxy]
thumbnail: /assets/posts/2021-10-18-lets-encrypt-certbot-https/thumbnail.jpg
---

웹 사이트에서 HTTPS를 사용하려면 **CA(인증 기관)에서 가져온 인증서**가 필요합니다.

[certbot](https://certbot.eff.org/)은 **개방형 무료 인증기관** [Let’s Encrypt](https://letsencrypt.org/ko/)에서 인증서를 **자동으로 발급**해주는 **무료 오픈소스 도구**로,

이를 이용하면 쉽게 인증서를 발급받아 웹 사이트에 HTTPS를 적용할 수 있습니다.


## certbot

> 이 글은 Ubuntu 20.04를 기준으로 설치 방법에 대해 설명합니다.

가장 권장하는 **certbot 설치 방법**은 [snap](https://snapcraft.io/)을 이용하는 것입니다.

snap은 다양한 Linux 배포판에서 일관되게 작동할 수 있도록 **앱과 의존성을 묶어 하나로 배포한 프로그램**입니다.

Ubuntu 18.04 이상 버전에서는 **snap이 기본적으로 설치**되어 있기 때문에 바로 사용할 수 있습니다.

만약 snap이 설치되어 있지 않은 버전은 아래 문서를 확인해주세요.

참고: [Installing snapd](https://snapcraft.io/docs/installing-snapd)

snap 설치가 끝났다면, **snap core을 최신버전으로 업데이트** 해주세요.

```txt
$ sudo snap install core
$ sudo snap refresh core
```

그리고 **certbot을 설치**하세요.

```txt
$ sudo snap install --classic certbot
```

certbot의 명령을 cmd에서 사용할 수 있게 `/usr/bin`으로 **링크**를 걸어주세요.

```txt
$ sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

아래 명령어를 이용해 **certbot을 실행**시키세요.

다른 웹 서버가 이미 **80 포트**를 사용하고 있다면 `--standalone` 대신 `--webroot`를 사용하세요.

```txt
$ sudo certbot certonly --standalone
```

인증서 발급이 완료되면, 인증서들은 `/etc/letsencrypt/live/your.domain.com/` 디렉토리에 저장됩니다.

```txt
$ sudo ls /etc/letsencrypt/live/your.domain.com
README
cert.pem
chain.pem
fullchain.pem
privkey.pem
```

- `cert.pem` - 웹 사이트 인증서
- `privkey.pem` - 웹 사이트 인증서에 대한 개인 키 **(절대 유출 되면 안됨)**
- `chain.pem` - Let's Encrypt의 중간 인증서
- `fullchain.pem` - `cert.pem`과 `chain.pem`를 합친 파일

참고: [certbot instructions](https://certbot.eff.org/instructions)

## HAProxy

다음은 발급 받은 인증서를 이용해 **웹 사이트에 HTTPS를 적용**하겠습니다.

HAProxy에서는 **하나의 pem 파일**만을 읽어 적용하기 때문에, `cat`을 이용해 인증서를 하나로 합쳐줍니다.

```txt
$ cat cert.pem chain.pem privkey.pem > site.pem
```

통합 인증서 `site.pem`은 인증서 디렉토리로 이동시켜 줍니다.

이때 `site.pem`은 **개인 키가 포함된 상태**이므로, 외부로 유출되지 않게 주의합니다.

> pem 파일에 개인키가 존재하지 않을 경우, HAProxy는 해당 디렉토리에서 **.key 확장자 파일**을 찾아 **개인 키**로 적용합니다.

`haproxy.cfg` 파일에 인증서 파일 경로를 넣어줍니다.

`haproxy.cfg`:

```txt
frontend gateway
    mode http
    bind :80
    bind :443 ssl crt /etc/ssl/certs/site.pem alpn h2,http/1.1
    default_backend servers
```

> `alpn`은 ALPN(Application Layer Protocol Negotiation) 기능을 활성화하는 옵션으로, TLS handshake 이후의 **프로토콜과 버전을 결정**하기 위한 기능입니다.

사용자가 HTTP를 이용해 웹 사이트에 접근할 때, HTTPS로 접속하도록 강제하는 **HTTP Strict Transport Security (HSTS) 기능**을 만들어 봅시다.

`ssl_fc` 값을 이용해 HTTPS 여부를 확인하고, HTTP일 경우는 **301 Moved Permanently**를 이용해 HTTPS로 리다이렉트 시킵니다.

`Strict-Transport-Security` 응답 헤더는 **HTTP 대신 HTTPS만을 사용하여 통신**해야 한다고 웹 사이트가 브라우저에 알리는 보안 기능입니다.

참고: [Strict-Transport-Security](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Strict-Transport-Security)

`haproxy.cfg`:

```txt
frontend gateway
    mode http
    bind :80
    bind :443 ssl crt /etc/ssl/certs/site.pem alpn h2,http/1.1
    http-request redirect scheme https code 301 unless { ssl_fc }
    http-response set-header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload;"
    default_backend servers
```

> 일반적인 리다이렉트는 **302 Found**를 이용하는데, 이는 **임시적인 리다이렉션**을 의미합니다.
>
> HTTPS는 일회성 사용 아니기 때문에 `code 301`을 **명시적으로 작성**해 301 Moved Permanently를 사용하도록 합니다.

참고: [Redirect HTTP to HTTPS with HAProxy](https://www.haproxy.com/blog/redirect-http-to-https-with-haproxy/)
