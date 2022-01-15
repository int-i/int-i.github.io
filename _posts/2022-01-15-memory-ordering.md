---
title: "Memory Ordering: 자네는... 아직도... 컴파일러를 믿나?"
date: 2022-01-15
author: Astro36
category: rust
tags: [rust, computer_science, memory, ordering, compiler]
thumbnail: /assets/posts/2022-01-15-memory-ordering/thumbnail.jpg
---

> Memory Ordering: CPU가 컴퓨터 메모리에 **액세스하는 순서**를 정의

컴파일러에서는 **효율성**을 위해 프로그램 코드의 **순서를 임의로 바꿔** 코드를 컴파일할 수 있습니다.

또한, 멀티 코어 시스템에 대한 **제약조건이 없으면** 여러 스레드가 동시에 여러 변수를 읽고 쓸 때, 스레드마다 각기 **다른 순서로 값 변경**을 관찰할 수 있습니다.

이로 인해 Memory ordering 개념이 나오게 되었고, **메모리를 읽고 쓰는 순서**를 정의함으로써 **의도치 않은 순서로 메모리에 접근**하는 문제를 해결할 수 있습니다.

Memory ordering은 크게 **5가지**로 구분됩니다.
아래로 갈수록 제약이 강해지는 순서입니다.

- Relaxed
- Acquire
- Release
- AcqRel
- SeqCst

Relaxed는 이름에서 알 수 있듯이 **가장 완화**된 제약조건입니다.

제약조건이라 부를 것도 없이, Relaxed 방식은 명령 주위의 다른 메모리 접근과 순서에 대한 **어떠한 제약도 없습니다**.

따라서 **가장 적극적인 최적화**가 가능한 Memory ordering이기도 합니다.

Acquire와 Release는 **쌍**을 이뤄 동작합니다.

Acquire은 Release로 저장된 메모리 값을 읽어올 때, 메모리 변수를 동기화시키는 방식입니다.

또한, Acquire 명령 아래에 오는 모든 메모리 명령은 Acquire 명령 **위로 재배치되지 않습니다.**

반대로, Release 명령 위에 오는 모든 메모리 명령은 Release 명령 **아래로 재배치되지 않습니다.**

따라서, **Release로 저장**된 변수를 **Acquire로 읽어**오면 주위의 **명령어 재배치**가 일어나더라도 프로그래머가 **의도한 대로 동작하는 것이 보장**됩니다.

AcqRel은 Acquire과 Release의 **특성을 모두** 가진 방식입니다.

Acquire이나 Release보다 **더 강한 제약 조건**으로, `fetch_add` 등에 사용하면 적절합니다.

SeqCst는 메모리 명령의 **순차적 일관성(Sequential consistency)을 보장**하는 방식입니다.

즉, 메모리 재배치 없이 **코드에 작성된 그대로** 프로그램을 컴파일하는 것과 **동일한 결과**가 나오도록 하라는 것입니다.

그만큼 **최적화가 제한**되기 때문에 **최대한 지양**하는 방식이기도 합니다.

예시를 보여주겠습니다.

[`qp`](https://crates.io/crates/qp)에서 사용하는 세마포어 코드입니다.
불필요한 부분은 생략했습니다.

```rs
impl Semaphore {
    // ...
    pub fn try_acquire(&self) -> Option<SemaphorePermit> {
        // ...
        let mut permits = self.permits.load(Ordering::Relaxed); // 1
        loop {
            // ...
            match self.permits.compare_exchange_weak(
                permits,
                permits - 1,
                Ordering::Acquire, // 2
                Ordering::Relaxed, // 3
            ) {
                Ok(_) => return Some(SemaphorePermit::new(self)),
                Err(changed) => permits = changed,
            }
            // ...
        }
    }
}
// ...
impl Drop for SemaphorePermit<'_> {
    fn drop(&mut self) {
        self.semaphore.permits.fetch_add(1, Ordering::Release); // 4
        // ...
    }
}
```

1. `self.permits.load`는 어떤 제약도 **필요하지 않습니다.**

   `Drop`에서 `fetch_add`된 **값을 읽어**야 하기 때문에 **Acquire가 필요**한 것 아니냐고 반문할 수도 있지만, 메모리를 잘못 읽었을 경우에는 `compare_exchange_weak`가 **실패**하기 때문에 제약을 걸어둘 필요가 없습니다.

2. 반면 `self.permits.compare_exchange_weak`는 Acquire로, `fetch_add`된 값과 **동기화시켜 읽게** 해야 합니다.

3. 값 교환(exchange)가 실패한 경우는 당연히도 어떠한 **동기화가 필요 없기**에 Relaxed입니다.

4. 마지막으로 `self.semaphore.permits.fetch_add`는 값을 저장하는 부분이므로 Release입니다.

참고: [C++11 Memory Model: Atomic부터 Lock-Free 자료구조까지](https://velog.io/@codingskynet/C11-Memory-Model-Atomic%EB%B6%80%ED%84%B0-Lock-Free-%EC%9E%90%EB%A3%8C%EA%B5%AC%EC%A1%B0%EA%B9%8C%EC%A7%80)

참고: [씹어먹는 C++ - <15 - 3. C++ memory order 와 atomic 객체>](https://modoocode.com/271)

참고: [Rust std::sync::atomic::Ordering](https://doc.rust-lang.org/std/sync/atomic/enum.Ordering.html)

참고: [C++ std::memory_order](https://en.cppreference.com/w/cpp/atomic/memory_order)
