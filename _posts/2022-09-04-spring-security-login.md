---
title: "역시 Spring Security야. 성능 확실하구만: Spring Security로 로그인 API 구현하기"
date: 2022-09-04
author: Astro36
category: java
tags: [java, spring, springboot, security, gradle, auth, login, jwt, filter, mysql, db, entity, repository]
thumbnail: /assets/posts/2022-09-04-spring-security-login/thumbnail.jpg
---

Spring Security를 의존성에 추가하면 프로젝트에 **기본적인 로그인 기능**이 추가됩니다.

`@Controller`를 이용해 직접 로그인 API를 구현하는 방법도 있으나, Spring Security에서 이미 제공되는 **로그인 기능을 수정**해 사용한다면 더 적은 노력으로도 뛰어난 로그인 기능을 구현할 수 있습니다.

[`UsernamePasswordAuthenticationFilter`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/web/authentication/UsernamePasswordAuthenticationFilter.html)는 사용자로부터 들어오는 **로그인 요청을 처리**하는 객체로,

이번 글에서는 `UsernamePasswordAuthenticationFilter`를 통해 **JWT(JSON Web Token) 로그인** 기능을 구현할 것입니다.

## Gradle

먼저, **의존성**에 JWT와 Spring Securiy를 **추가**합니다.

```groovy
dependencies {
    implementation 'com.auth0:java-jwt:4.0.0'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    runtimeOnly 'mysql:mysql-connector-java'
}
```

취향에 따라 [JJWT](https://github.com/jwtk/jjwt)를 선택해도 됩니다.

JJWT를 쓰는 경우, 아래 JWT 코드를 적절히 **수정**하여 적용해야 합니다.

```groovy
compile 'io.jsonwebtoken:jjwt-api:0.11.5'
runtime 'io.jsonwebtoken:jjwt-impl:0.11.5'
```

## Entity

그다음 사용자 정보를 담는 **DB 테이블**을 만듭니다.

Spring과 함께 가장 대중적으로 사용되는 **MySQL** 기준으로 작성했습니다.

```sql
CREATE TABLE users (
    id               INT           NOT NULL PRIMARY KEY,
    password_hashed  VARCHAR(255)  NOT NULL
);
```

생성된 테이블과 자바의 클래스를 **연결**합니다.

[`UserDetails`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/core/userdetails/UserDetails.html)는 Spring Security에서 사용하는 **사용자 클래스**입니다.

DB의 사용자와 Security의 사용자를 별도의 클래스로 나누어 서로 변환해가며 사용하는 방법도 있지만,

간단한 로그인 기능을 구현할 때는 그냥 **상속받아 사용**하는 방법이 **간편**하지 않을까 싶습니다.

```java
@Entity(name = "users")
public class User implements UserDetails {
    @Id
    private Integer id; // 아이디(학번)
    private String passwordHashed; // 암호화된 비밀번호

    // Constructor

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return new ArrayList<>(); // 사용자별 권한 설정은 사용하지 않을 예정
    }

    @Override
    public String getPassword() {
        return passwordHashed;
    }

    @Override
    public String getUsername() {
        return String.valueOf(id);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 유효한 계정
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 사용불가(잠금)하지 않은 계정
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 비밀번호가 만료되지 않음
    }

    // Getter, Setter
}
```

Entity 클래스의 `camelCase` 멤버 변수 이름은 DB의 `snake_case` 형식과 자동으로 **매칭**되니, DB 테이블과 이름을 맞추기 위해 멤버 변수 이름을 `snake_case`으로 작성할 필요는 없습니다.

## Service

이제 DB에서 사용자를 **조회/수정**하는 역할을 하는 **Repository 클래스**를 구현합니다.

```java
@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
}
```

[`CrudRepository`](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)를 상속받은 인터페이스는 **자동으로 CRUD 기능에 대한 함수**를 구현합니다.

참고: [Spring Data JPA - Repository query keywords](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#appendix.query.method.subject)

다음은 `UserRepository`를 이용해 **사용자를 조회**하는 기능을 하는 [`UserDetailsService`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/core/userdetails/UserDetailsService.html)을 구현합니다.

`UserDetailsService`는 Spring Security **내부에서 사용**하는 객체이므로 반드시 `UserDetailsService`를 **상속받아 구현**해야 합니다.

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository; // 의존성 주입(DI)

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Integer userId = Integer.valueOf(username); // 아이디(학번)
        return userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException(String.format("user_id=%d", userId)));
    }
}
```

참고: [Spring 의존성 주입의 3가지 방법](https://dev-coco.tistory.com/70)

## POST /login

`UsernamePasswordAuthenticationFilter`를 상속받아 **로그인 성공 시 호출할 함수**를 정의합니다.

올바른 아이디와 비밀번호를 입력해 로그인을 성공하면, 서버는 사용자에게 로그인에 사용하는 **JWT를 반환**해야 합니다.

```java
public class JwtLoginFilter extends UsernamePasswordAuthenticationFilter {
    public JwtLoginFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) {
        try {
            User user = (User) authResult.getPrincipal();
            String username = user.getUsername(); // 아이디(학번)

            // JWT 생성
            Algorithm algorithm = Algorithm.HMAC256("secret");
            String accessToken = JWT.create()
                                    .withIssuer("issuer")
                                    .withSubject(username)
                                    .sign(algorithm);

            response.getWriter().write(accessToken);
        } catch (JWTCreationException | IOException exception) {
            exception.printStackTrace();
        }
    }
}
```

Issuer(`iss`)는 **JWT를 발급하는 주체**(서비스명)가 들어가야 하며, 알고리즘에 사용되는 Secret은 외부로 유출될 시 **사용자 보안**이 무너지기 때문에 조심해야 합니다.

## Authenticated API

`JwtDecodeFilter`는 로그인이 성공한 사용자에게 받은 **JWT를 해석**해서 누가 서버에 접근했는지 알아오는 클래스입니다.

```java
@Component
public class JwtDecodeFilter extends OncePerRequestFilter {
    private final UserDetailsServiceImpl userDetailsService;

    public JwtDecodeFilter(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization"); // Authorization: Bearer aaa.bbb.ccc
        if (header != null && header.startsWith("Bearer ")) {
            try {
                String accessToken = header.substring(7);

                // JWT 해석
                Algorithm algorithm = Algorithm.HMAC256("secret");
                JWTVerifier verifier = JWT.require(algorithm).withIssuer("issuer").build();
                DecodedJWT jwt = verifier.verify(accessToken);
                String username = jwt.getSubject(); // 아이디(학번)

                User user = (User) userDetailsService.loadUserByUsername(username);
                Authentication authenticationToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            } catch (JWTVerificationException exception) {
                exception.printStackTrace();
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

사용자의 신원은 요청 당 **한 번 만 확인**하면 되므로, [`OncePerRequestFilter`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/filter/OncePerRequestFilter.html)를 상속받아 구현합니다.

Secret과 Issuer는 JWT를 만들 때 사용한 값과 **동일**하게 구성합니다.

JWT가 **HTTP 헤더**를 이용해 `Authorization: Bearer aaa.bbb.ccc`과 같은 형식으로 들어온다고 가정했으니,

이와 다른 방식을 사용해 JWT를 전송하는 경우 적절하게 수정해서 사용하면 됩니다.

## SecurityConfig

마지막으로 지금까지 정의한 클래스를 **조립**합니다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtDecodeFilter jwtDecodeFilter;
    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(JwtDecodeFilter jwtDecodeFilter, UserDetailsServiceImpl userDetailsService) {
        this.jwtDecodeFilter = jwtDecodeFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userDetailsService);
        AuthenticationManager authenticationManager = authenticationManagerBuilder.build();

        JwtLoginFilter jwtLoginFilter = new JwtLoginFilter(authenticationManager);
        jwtLoginFilter.setUsernameParameter("id");
        jwtLoginFilter.setPasswordParameter("password");

        return http
            .csrf().disable()
            .formLogin().disable()
            .httpBasic().disable()
            .authorizeRequests()
                .antMatchers("/login").permitAll()
                .anyRequest().authenticated()
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authenticationManager(authenticationManager)
            .addFilterBefore(jwtDecodeFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterAt(jwtLoginFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() { // 비밀번호 암호화
        return new BCryptPasswordEncoder();
    }
}
```

> [`WebSecurityConfigurerAdapter`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/config/annotation/web/configuration/WebSecurityConfigurerAdapter.html)는 이제 **Deprecated** 되었으니 [`SecurityFilterChain`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/web/SecurityFilterChain.html) Bean을 이용해 [`HttpSecurity`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/config/annotation/web/builders/HttpSecurity.html)를 정의하면 됩니다.

`passwordEncoder`는 평문으로 들어오는 비밀번호를 DB의 **암호화된 비밀번호**와 비교할 때 사용하는 알고리즘을 정의하면 됩니다.

위 코드를 이용해 만든 **예제 프로젝트**는 [int-i/spring-example](https://github.com/int-i/spring-example)에서 확인할 수 있습니다.
