---
title: "EnvironmentPostProcessor로 Docker Secret 수정하는 법"
date: 2022-09-18
author: Astro36
category: java
tags: [java, spring, docker, secret, environment, config]
thumbnail: /assets/posts/2022-09-18-spring-docker-secret/thumbnail.jpg
---

[Docker secret](https://docs.docker.com/engine/swarm/secrets/)은 비밀번호와 같이 **민감한 데이터**를 관리하는 서비스입니다.

하지만, **파일**의 형태로 접근해야 하기 때문에 `application.properties`에 적용하면 secret 내용이 아닌 secret 이름만 가져오게 됩니다.

`resources/application.properties`:

```txt
spring.datasource.password-file=/run/secrets/db_password
```

Spring의 **EnvironmentPostProcessor**를 이용하면 `application.properties`의 값을 **수정**할 수 있습니다.

`spring.datasource.password-file`의 내용물을 읽어 `spring.datasource.password`으로 대체할 것입니다.

`DockerSecretPostProcessor.java`:

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.env.PropertySource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Properties;

public class DockerSecretPostProcessor implements EnvironmentPostProcessor {
    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String password_file = environment.getProperty("spring.datasource.password-file");
        if (password_file != null) {
            try {
                String password = String.join("", Files.readAllLines(Path.of(password_file)));
                Properties properties = new Properties();
                properties.put("spring.datasource.password", password);
                PropertySource<Map<String, Object>> propertySource = new PropertiesPropertySource("docker-secret", properties);
                environment.getPropertySources().addLast(propertySource);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```

> `String.join("", Files.readAllLines(Path.of(password_file)))`은 **파일 내용**을 읽어오는 코드입니다.

`DockerSecretPostProcessor`가 실행되면 **비밀번호 문자열**이 들어있는 `spring.datasource.password`가 추가됩니다.

마지막으로 `resources`에 `META-INF` 디렉토리를 만들고 `spring.factories`에 `DockerSecretPostProcessor` **위치를 등록**합니다.

`resources/META-INF/spring.factories`:

```txt
org.springframework.boot.env.EnvironmentPostProcessor=io.github.int_i.DockerSecretPostProcessor
```
