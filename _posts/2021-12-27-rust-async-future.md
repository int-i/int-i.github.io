---
title: "Rust: 비동기 프로그래밍, 그리고 Future"
date: 2021-12-27
author: Astro36
category: rust
tags: [rust, async, await, future, trait]
thumbnail: /assets/posts/2021-12-27-rust-async-future/thumbnail.jpg
---

> 비동기(Asynchronous) 프로그래밍: 프로그램 코드가 순차적으로 실행됨을 보장하지 않음

일반적으로, 프로그램의 코드는 **순차적으로 실행**됩니다.

한 함수가 실행되면, 그 다음 함수는 **실행 중인 함수가 종료**되고 결과를 반환할 때까지 **대기해야** 합니다.

하지만 파일 읽기/쓰기, 데이터베이스 동기화 등, CPU 연산 시간보다 **다른 대상(운영체제 등)에 맡겨두고 결과를 기다리는 시간이 더 긴 작업**까지도 함수를 순차적으로 실행하기 위해 무작정 기다리는 것은 너무 **비효율적**일 겁니다.

차라리 현재 함수가 완료되기를 기다리면서 **놀고 있는 CPU를 다른 함수를 실행**하는데 사용할 수 있다면, 프로그램은 더 **효율적**으로 동작할 것입니다.

"함수를 기다리지 말고 계속 진행하자!"

이것이 **비동기 프로그래밍의 핵심**입니다.

## Future

Rust에서는 [`Future`](https://doc.rust-lang.org/std/future/trait.Future.html)와 `async`/`await`를 이용해 **비동기 함수를 작성**합니다.

`Future`는 **아직 결과를 얻지 못했을 수도 있는** 객체입니다.

비동기 함수는 동기 함수와 다르게 **언제 결과를 받을 수 있지 모릅니다.**

예시를 보여주면,

```rs
let sum = add(1, 9);
let total = multiply(sum, 2);
```

위 코드에서 `add` 함수는 `multiply` 함수가 **실행되기 전까지**는 결과를 반환해 **`sum`에 저장**할 것입니다.

그렇다면 비동기 함수일 때는 어떻게 되는지 생각해보죠.

```rs
let sum = async_add(1, 9);
let total = multiply(sum, 2);
```

만약 `async_add`가 비동기 함수라면, 개념상으로는 `async_add` **계산이 끝나기도 전에 `multiply` 함수가 실행**될 수 있습니다.

이는 논리적으로 **말이 안되는 상황**입니다.

`multiply`는 `async_add`의 결과인 **`sum`이 필요**하기 때문이죠.

따라서 `Future`를 이용해 `sum`은 아직 `async_add`로부터 **결과를 받지 못했을 수도 있다는 것을 명시**해야 합니다.

그렇다면 `async_add` 함수는 아래와 같이 정의될 것입니다.

```rs
fn async_add(a: i32, b: i32) -> impl Future<Output=i32>
```

당연하게도 **`multiply` 함수도 비동기 함수**가 되어야 합니다.

`sum`을 언제 받을지 모른다면, `total`를 언제 반환할 수 있을지도 모르기 때문입니다.

## async/await

위 예시처럼 한 번 만들어진 `Future`는 **계속 전파**되기 때문에, 언젠가는 모든 코드가 `Future`로 뒤덮일지도 모릅니다.

그렇게 되면, 코드를 알아보기 매우 어려울 것이기에 **비동기 프로그래밍을 위한 키워드**, `async`/`await`가 있습니다.

> 모든 함수를 비동기로 작성하는 것 자체가 잘못된 것은 아닙니다.
>
> 오히려 더 좋은 성능이 나올지도 모르죠.
>
> 문제는 여기저기 복잡하게 얽혀있는 `Future` 때문에 코드를 읽기 어려워지는 것입니다.

`async`는 함수가 **암시적으로 `Future`를 반환**하게 만듭니다.

```rs
async fn async_add(i32, i32) -> i32
```

위 코드는 아래 코드와 동일합니다.

```rs
fn async_add(i32, i32) -> impl Future<Output=i32>
```

`await`는 비동기 함수가 완료되어 **결과를 반환할 때까지 비동기적으로 기다립니다.**

```rs
let sum: i32 = async_add(1, 9).await;
let total = multiply(sum, 2);
```

`await`를 이용해 `sum`의 값을 받아냈으므로, 이 경우는 `multiply`를 비동기 함수로 만들지 않아도 됩니다.

`await`는 **비동기 함수와 동기 함수를 함께 사용**할 수 있게 하는 역할을 한다고 생각하면 됩니다.

## impl Future

```rs
pub trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
```

`Future`는 `trait`으로, **함수를 비동기**로 만들기 위해서는 `trait`을 **직접 구현**해야 합니다.

`poll` 함수가 그 중심에 있는데, **작업 완료 여부**에 따라 `Poll::Ready`와 `Poll::Pending`을 반환합니다.

아직 작업이 완료되지 않은 상태라면, `Poll::Pending`을 반환합니다.
그리고, `Context`의 `Waker`를 이용해 **완료 예상시점**에 다시 `poll`을 호출하여 **완료 여부를 확인**합니다.

작업이 끝났다면 `Poll::Ready(value)`로 **값이 준비(ready)되었다고 알림**과 동시에 **값을 반환**합니다.

여기서 `await`는 **최초로 `poll` 함수를 호출**해 **Future에 등록된 작업을 실행**하는 역할을 합니다.

### Delay Future 예제

지정한 시각 이후에 다시 작업을 시작하는 딜레이 Future를 구현해봅시다.

```rs
struct Delay {
    when: Instant,
}

// Future 구현
impl Future for Delay {
    type Output = (); // 반환 값 없음

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>
    {
        if Instant::now() >= self.when { // 지정한 시각 이후
            Poll::Ready(()) // 완료, Future 종료
        } else { // 지정한 시각이 안 됐음
            cx.waker().wake_by_ref(); // 다시 poll 실행해서 확인할 것
            // 다음 poll에는 현재보다 조금 시간이 흘렀을 것이므로, 지정한 시각을 넘었을 수도 있음
            Poll::Pending // 아직 안 끝남
        }
    }
}
```

`println`과 같은 동기 코드와 함께 `Future`를 사용할 때는 아래와 같이 **`await`를 통해 실행**하면 됩니다.

```rs
async fn main() {
    let when = Instant::now() + Duration::from_millis(10);
    let delay = Delay { when };
    delay.await;
    println!("after 10ms");
}
```

참고: [Asynchronous Programming Book](https://rust-lang.github.io/async-book/)

참고: [Tokio - Async in depth](https://tokio.rs/tokio/tutorial/async)

참고: [A stack-less Rust coroutine library under 100 LoC](https://blog.aloni.org/posts/a-stack-less-rust-coroutine-100-loc/)

참고: [The Waker API I: what does a waker do?](https://boats.gitlab.io/blog/post/wakers-i/)

참고: [Async 공부](https://neurowhai.tistory.com/360)
