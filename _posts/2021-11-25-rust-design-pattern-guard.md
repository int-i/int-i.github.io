---
title: "Rust 디자인 패턴: 가드(Guard) 패턴과 RAII"
date: 2021-11-25
author: Astro36
category: rust
tags: [rust, design_pattern, guard, raii]
thumbnail: /assets/posts/2021-11-25-rust-design-pattern-guard/thumbnail.jpg
---

**가드(Guard) 패턴**은 객체 외부에서 **객체 내부로의 접근을 제한**하기 위한 디자인 패턴입니다.

만약 **내부 값에 접근**하기 위해서는, 래퍼 구조체(Wrapper Struct)인 **가드(Guard)를 통해**야 합니다.

이때, 가드 객체를 **일반적인 객체**처럼 다루기 위해 **[`Deref`](https://doc.rust-lang.org/stable/std/ops/trait.Deref.html)와 [`DerefMut`](https://doc.rust-lang.org/stable/std/ops/trait.DerefMut.html) 트레잇(Trait)을 구현**합니다.

> Rust에서는 **역참조 강제(Deref Coercion)을 통해 `&`와 `*`를 생략해도 정상**적으로 동작합니다.
>
> 참고: [Deref 트레잇을 가지고 스마트 포인터를 평범한 참조자와 같이 취급하기](https://rinthel.github.io/rust-lang-book-ko/ch15-02-deref.html)

가드 패턴은 주로 **[`Drop`](https://doc.rust-lang.org/std/ops/trait.Drop.html) 트레잇**과 함께 RAII(Resource Acquisition is Initialisation)에 사용합니다.

> RAII는 "자원의 획득은 초기화다"라는 뜻으로, 객체의 **생성-소멸 수명 주기**에 따라 메모리 등의 **자원을 할당하고 해제**하는 코딩 기법입니다.
>
> 참고: [C++ RAII](https://en.cppreference.com/w/cpp/language/raii)

표준 라이브러리에서는 [`MutexGuard`](https://doc.rust-lang.org/std/sync/struct.MutexGuard.html)가 대표적인 가드 패턴의 예시입니다.

```rs
let mutex = Mutex::new(0);
let guard = mutex.lock().unwrap();
*guard += 1;
drop(guard);
```

[`lock`](https://doc.rust-lang.org/std/sync/struct.Mutex.html#method.lock) 함수는 **값에 락(Lock)을 걸고**, 값을 가지고 있는 `MutexGuard`를 반환합니다.

```rs
pub struct MutexGuard<'a, T: ?Sized + 'a> {
    lock: &'a Mutex<T>,
    poison: poison::Guard,
}
```

`guard`는 **`Deref`가 구현**되어 있기 때문에 `*guard`로 **내부 값에 접근**할 수 있습니다.

```rs
impl<T: ?Sized> Deref for MutexGuard<'_, T> {
    type Target = T;

    fn deref(&self) -> &T {
        unsafe { &*self.lock.data.get() }
    }
}

impl<T: ?Sized> DerefMut for MutexGuard<'_, T> {
    fn deref_mut(&mut self) -> &mut T {
        unsafe { &mut *self.lock.data.get() }
    }
}
```

[`drop`](https://doc.rust-lang.org/std/mem/fn.drop.html)이 호출되어 `MutexGuard`가 소멸되면 `Drop` 트레잇 구현의 **`unlock`이 호출**되어 자동으로 락이 풀리게 됩니다.

```rs
impl<T: ?Sized> Drop for MutexGuard<'_, T> {
    #[inline]
    fn drop(&mut self) {
        unsafe {
            self.lock.poison.done(&self.poison);
            self.lock.inner.raw_unlock();
        }
    }
}
```

**가드 패턴과 RAII**를 이용하면, 자원의 사용이 끝난 이후에 **자원을 해제하지 않아 발생하는 버그**를 예방할 수 있습니다.

참고: [RAII with guards](https://rust-unofficial.github.io/patterns/patterns/behavioural/RAII.html)
