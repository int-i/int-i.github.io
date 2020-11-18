---
title: "TensorFlow C API를 이용해 C/C++에서 TensorFlow 모델 사용하기"
date: 2020-11-18
author: Astro36
category: cpp
tags: [c, cpp, tensorflow, keras, machine_learning, deep_learning, xor]
---

[TensorFlow for C](https://www.tensorflow.org/install/lang_c)를 이용하면 C와 C++에서 TensorFlow 모델을 불러와 사용할 수 있습니다.

TensorFlow는 C++로 작성되어 있기 때문에 TensorFlow Core API를 직접 불러와 사용할 수도 있지만, 예고 없이 API가 변경될 수 있기 때문에 **TensorFlow C API 사용을 권장**하고 있습니다.

## Python

TensorFlow C++ 코드를 작성하기에 앞서, 코드를 테스트할 모델을 만듭니다.

```py
from tensorflow.keras import Input, Sequential
from tensorflow.keras.layers import Dense

x = [[0, 0], [0, 1], [1, 0], [1, 1]]
y = [[0], [1], [1], [0]]

model = Sequential([
    Input(shape=(2,), name='input', dtype='int32'),
    Dense(16, activation='relu'),
    Dense(1, activation='sigmoid', name='output')
])
model.summary()

model.compile(optimizer='adam', loss='mse', metrics=['acc'])

history = model.fit(x, y, epochs=500, verbose=2)

model.save('data/saved_model')  # save as tf saved model

model.predict(x)  # test
```

```txt
Epoch 1/500
1/1 - 0s - loss: 0.2559 - acc: 0.7500
Epoch 2/500
1/1 - 0s - loss: 0.2555 - acc: 0.5000
Epoch 3/500
1/1 - 0s - loss: 0.2550 - acc: 0.5000
...
Epoch 498/500
1/1 - 0s - loss: 0.0823 - acc: 1.0000
Epoch 499/500
1/1 - 0s - loss: 0.0820 - acc: 1.0000
Epoch 500/500
1/1 - 0s - loss: 0.0817 - acc: 1.0000

array([[0.3111288 ],
       [0.72106665],
       [0.724661  ],
       [0.27483132]], dtype=float32)
```

![Model](/assets/posts/2020-11-18-libtensorflow/model.png)

간단하게 XOR 연산에 대해 출력값을 예측하는 모델을 생성했습니다.

## C++

이제 C++ 코드로 돌아가 C API 헤더를 추가합니다.

라이브러리(libtensorflow) 설치에 대해서는 [TensorFlow for C](https://www.tensorflow.org/install/lang_c)를 참고하세요.

```cpp
#include <tensorflow/c/c_api.h>
```

아래 코드를 통해 libtensorflow가 정상적으로 설치되고 링크되었는지 확인할 수 있습니다.

```cpp
#include <iostream>

int main() {
    std::cout << "TensorFlow Version: " << TF_Version() << std::endl;
    return 0;
}
```

TensorFlow에서 모델은 `TF_LoadSessionFromSavedModel` 함수로 불러올 수 있습니다.
먼저 TensorFlow의 Session을 불러오는 함수의 인자에 필요한 값을 정의하고 초기화합니다.

```cpp
auto *run_options = TF_NewBufferFromString("", 0);
auto *session_options = TF_NewSessionOptions();
auto *graph = TF_NewGraph();
auto *status = TF_NewStatus();
std::array<char const *, 1> tags{ "serve" };
```

이때 `"serve"`는 사용할 모델의 태그 이름으로, [SavedModel CLI](https://www.tensorflow.org/guide/saved_model#details_of_the_savedmodel_command_line_interface)를 이용해 찾아올 수 있습니다.
태그의 **기본값**은 `"serve"`로, 위 코드와 같이 모델을 저장했다면 태그 이름으로 `"serve"`를 넣어 모델을 불러올 수 있을 것입니다.

> [SavedModel CLI](https://www.tensorflow.org/guide/saved_model#details_of_the_savedmodel_command_line_interface) 항목에 SavedModel의 정보를 가져오는 방법이 자세히 나와 있습니다.
>
> ```bash
> $ saved_model_cli show --dir data/saved_model/ --tag_set serve --signature_def serving_default
> ...
> The given SavedModel SignatureDef contains the following input(s):
>   inputs['input'] tensor_info:
>       dtype: DT_INT32
>       shape: (-1, 2)
>       name: serving_default_input:0
> The given SavedModel SignatureDef contains the following output(s):
>   outputs['output'] tensor_info:
>       dtype: DT_FLOAT
>       shape: (-1, 1)
>       name: StatefulPartitionedCall:0
> Method name is: tensorflow/serving/predict
> ```

```cpp
auto* session = TF_LoadSessionFromSavedModel(session_options, run_options,
                                             "data/saved_model", tags.data(), tags.size(),
                                             graph, nullptr, status);
if (TF_GetCode(status) != TF_OK) {
    std::cout << TF_Message(status) << '\n';
}
```

> Tensorflow의 SavedModel을 `data/saved_model` 디렉토리에 넣어줘야 합니다.

모델이 정상적으로 불러와 져 `session`에 정상적으로 값이 할당되면, `TF_GetCode(status)`가 `TF_OK`가 됩니다.

이제 모델의 `graph`에서 Tensorflow의 Operation(연산)을 찾아야 합니다.
Operation 이름도 **SavedModel CLI**를 통해 찾을 수 있습니다.
위 파이썬 코드로 생성한 모델의 입력과 출력 Operation의 기본값은 각각 `"serving_default_input"`, `"StatefulPartitionedCall"`입니다.

```cpp
auto *input_op = TF_GraphOperationByName(graph, "serving_default_input");
if (input_op == nullptr) {
    std::cout << "Failed to find graph operation\n";
}

auto *output_op = TF_GraphOperationByName(graph, "StatefulPartitionedCall");
if (output_op == nullptr) {
    std::cout << "Failed to find graph operation\n";
}
```

Tensorflow에서는 입력과 출력 Operation이 **여러 개**일 수도 있으므로 이를 배열 형태로 받습니다.
따라서 우리도 저장할 값이 1개뿐이더라도, 사용하기 편리하게 이를 **배열 형태로 저장**해둡시다.

```cpp
std::array<TF_Output, 1> input_ops = { TF_Output{ input_op, 0 } };
std::array<TF_Output, 1> output_ops = { TF_Output{ output_op, 0 } };
```

> `TF_Output` 오타 아닙니다.
> `TF_SessionRun` 함수의 인자를 확인해보세요.

이제 학습된 모델에 값을 넣어 출력을 예측해봅시다.

```cpp
std::array<int, 2> x{ 1, 0 };
std::vector<std::array<int, 2>> inputs{ x };

std::array<int64_t, 2> const dims{ static_cast<int64_t>(inputs.size()), static_cast<int64_t>(x.size()) };
void *data = (void *) inputs.data();
std::size_t const ndata = inputs.size() * x.size() * TF_DataTypeSize(TF_INT32);

auto const deallocator = [](void *, std::size_t, void *) {}; // unused deallocator because of RAII

auto *input_tensor = TF_NewTensor(TF_INT32, dims.data(), dims.size(), data, ndata, deallocator, nullptr);
std::array<TF_Tensor *, 1> input_values{ input_tensor };

std::array<TF_Tensor *, 1> output_values{};
```

`[](void *, size_t, void *) {}`는 Deallocator로 저희는 C++의 **RAII**에 의존해 메모리를 관리하기 때문에 **빈 함수로 정의**했습니다.

만약 입력이 실수(float)인 경우에는 `TF_INT32`를 `TF_FLOAT`로 교체합니다.

`std::array<int> x`는 모델에 들어갈 실제 입력값 입니다.
이것을 `std::vector`로 감싸는 이유는, 주어진 모델이 여러 개의 입력을 한 번(Batch)에 계산할 수 있기 때문입니다.

`input_tensor`도 `std::array`로 감싸서 넣게 되는데, 이는 앞서 `input_ops`가 입력 Operation이 **여러 개**일 수도 있기 때문에 `std::array`로 감싸 넣은 이유와 같습니다.

입력 값을 Tensor로 변환하면 이를 모델의 입력 Operation에 넣어 출력값을 계산합니다.

```cpp
TF_SessionRun(session,
              run_options,
              input_ops.data(), input_values.data(), input_ops.size(),
              output_ops.data(), output_values.data(), output_ops.size(),
              nullptr, 0,
              nullptr,
              status);
if (TF_GetCode(status) != TF_OK) {
    std::cout << TF_Message(status) << '\n';
}
```

`TF_SessionRun`는 위에서 만들어둔 `input_ops`에 `input_values`을 넣어, `output_ops`까지 계산된 결과를 `output_values`에 저장합니다.

이제 `output_values`를 Tensor로 변환해 결과값을 출력해봅시다.

```cpp
auto *output_tensor = static_cast<std::array<float, 1> *>(TF_TensorData(output_values[0]));
std::vector<std::array<float, 1>> outputs{ output_tensor, output_tensor + inputs.size() };

std::cout << "output: " << outputs[0][0] << '\n'; // output: 0.907109
```

결과값을 다 썼으면, 사용한 메모리를 회수합니다.

```cpp
TF_DeleteTensor(input_values[0]);
TF_DeleteTensor(output_values[0]);
```

모델 사용이 끝나면 마찬가지로 사용한 메모리를 회수하고 리소스를 정리합니다.

```cpp
TF_DeleteBuffer(run_options);
TF_DeleteSessionOptions(session_options);
TF_DeleteSession(session, status);
TF_DeleteGraph(graph);
TF_DeleteStatus(status);
```

`input_ops[0].oper`는 `graph`에 저장된 Operaion의 포인터이기 때문에 별도로 `delete`할 필요는 없이, `TF_DeleteGraph`를 통해 같이 해제됩니다.

참고 1: [Deploying Tensorflow as C/C++ executable](https://github.com/AmirulOm/tensorflow_capi_sample)

참고 2: [Example TensorFlow C API](https://github.com/Neargye/hello_tf_c_api)
