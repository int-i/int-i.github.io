---
title: "Rust 에러 처리! Anyhow 몰?루"
date: 2022-01-23
author: Astro36
category: rust
tags: [rust, error, handling, anyhow, thiserror]
thumbnail: /assets/posts/2022-01-23-rust-error-anyhow/thumbnail.jpg
---

[Anyhow](https://crates.io/crates/anyhow)는 **일반화**된 `Error` 타입을 이용해 코드에서 발생하는 **에러를 한 가지 타입으로 처리**할 수 있게 도와주는 라이브러리입니다.

> any·how
>
> 1. = anyway
> 2. 되는대로, 아무렇게나
>
> 출처: 네이버 영어사전

Rust에서는 **엄격하게 타입을 검사**하기 때문에, 여러 라이브러리에서 사용하는 서로 다른 에러 타입을 처리하기 위해서는 [`map_err`](https://doc.rust-lang.org/std/result/enum.Result.html#method.map_err)로 에러를 **변환해 통일**하거나 `Box<dyn std::error::Error>`를 이용해 **타입을 뭉개**버리는 방법을 사용합니다.

> "타입을 뭉갠다"는 타입을 **일반화**하거나 타입의 **제약조건**을 덜어내는 것을 의미합니다.

`map_err`을 사용할 때는, **문자열**로 에러를 변환하거나 **새로운 에러 타입**을 만들어 통일합니다.

```rs
fn stringify(x: u32) -> String { format!("error code: {}", x) }

let x: Result<u32, u32> = Err(404);
x.map_err(stringify); // error code: 404
```

`Box<dyn std::error::Error>`는 "[`std::error::Error`](https://doc.rust-lang.org/std/error/trait.Error.html) **트레잇(Trait)을 구현**한 타입이면 **아무거나** 된다"라는 의미입니다.

트레잇이기 때문에 [`dyn`](https://doc.rust-lang.org/std/keyword.dyn.html) 키워드가 붙었고, 에러 **타입의 크기**를 정확히 모르기 때문에 [`Box`](https://doc.rust-lang.org/std/boxed/struct.Box.html)로 감싸줍니다.

```rs
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...
}
```

마찬가지로, Anyhow도 `Box<dyn std::error::Error>`와 **동일**하게 사용하면 됩니다.

```
fn get_cluster_info() -> anyhow::Result<ClusterMap> {
    let config = std::fs::read_to_string("cluster.json")?;
    let map: ClusterMap = serde_json::from_str(&config)?;
    Ok(map)
}
```

[`anyhow::Error`](https://docs.rs/anyhow/latest/anyhow/struct.Error.html)는 `Box<dyn std::error::Error>`와 매우 비슷하지만, 몇 가지 **차이점**이 있습니다.

- `Error`가 `Send`, `Sync`, `'static`이어야 합니다.

  즉, **스레드간 소유권 이전**(`Send`)과 **여러 스레드에서 접근**(`Sync`)이 가능해야 합니다.

  또한, `Error`가 가지고 있는 **참조는 항상 `'static`이어야** 합니다.

- `Error`의 **역추적(Backtrace)이 보장**됩니다.

에러를 출력할 때 사용하는 포맷(Format)도 더 **자세한 정보**를 제공합니다.

`{:#}`:

```txt
Failed to read instrs from ./path/to/instrs.json: No such file or directory (os error 2)
```

`{:?}`:

```txt
Error: Failed to read instrs from ./path/to/instrs.json

Caused by:
    No such file or directory (os error 2)
```

`{:#?}`:

```txt
Error {
    context: "Failed to read instrs from ./path/to/instrs.json",
    source: Os {
        code: 2,
        kind: NotFound,
        message: "No such file or directory",
    },
}
```

[`anyhow!`](https://docs.rs/anyhow/latest/anyhow/macro.anyhow.html) 매크로는 **문자열에서 에러**를 만들 때 사용합니다.

```rs
return Err(anyhow!("Missing attribute: {}", missing)); 
```

[`bail!`](https://docs.rs/anyhow/latest/anyhow/macro.bail.html)은 에러를 **조기에 반환**할 때 사용합니다.

`return Err(anyhow!("error message"))`와 **동일**한 동작을 합니다.

```rs
if !has_permission(user, resource) {
    bail!("permission denied for accessing {}", resource);
}
```
