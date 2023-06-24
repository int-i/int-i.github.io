---
title: "흔들리는 센서 속에서 네 노이즈가 느껴진거야: MPU6050과 상보필터"
date: 2023-06-24
author: Astro36
category: cpp
tags: [cpp, c, hardware, arduino, embedded_system, mpu6050, complementary_filter, gyroscope, accelerometer, sensor]
thumbnail: /assets/posts/2023-06-24-mpu6050-complementary-filter/thumbnail.jpg
---

**상보필터**는 시계열 데이터에서 새로운 값이 들어왔을 때 이전 값을 이용하여 오차를 보정하는 **재귀필터** 중 한 종류입니다.

![MPU6050](/assets/posts/2023-06-24-mpu6050-complementary-filter/mpu6050.png)

**MPU6050 모듈**은 대표적인 **자이로가속도 센서** 모듈로, 아두이노에서 로봇의 **기울어진 정도**를 구할 때 사용합니다.

## 각도 변환

MPU6050은 물체의 **가속도**와 **각속도**(자이로) 값을 출력하는데, 아래와 같이 각도로 변환할 수 있습니다.

![datasheet](/assets/posts/2023-06-24-mpu6050-complementary-filter/datasheet.png)

> MPU6050에 **온도**(`TEMP_OUT`) 센서도 포함되어 있는 이유는, 자이로 센서가 온도에 민감하게 반응하기 때문입니다.

### 가속도 -> 각도

```cpp
float angle_ax = atan(ay / sqrt(ax * ax + az * az)) * (180 / PI);
```

가속도 센서는 **충격과 진동에 민감**하게 반응하기 떄문에 물체가 급격하게 움직이면 큰 오차가 발생합니다.

따라서 가속도를 이용해 각도를 계산한다면, 순간적으로 값이 튀는 **고주파 노이즈**를 걸러줄 필요가 있습니다. 

### 각속도 -> 각도

```cpp
float angle_gx = 0;

float gx = (float) gx / 131;
angle_gx += gx * dt;
```

> `dt`는 샘플링 간격(`angle_gx` 업데이트 주기)입니다.

코드에서 보시다시피, 자이로 센서는 **값을 누적**하여 각도를 계산합니다.

따라서 `angle_gx`에는 오차가 누적되게 되며, 이는 **저주파 노이즈**를 만들어 냅니다.

## 상보필터

![complementary-filter](https://www.researchgate.net/profile/Thomas-Schoen-4/publication/336097733/figure/fig1/AS:809979766378496@1570125633068/Illustration-of-the-complementary-filter-for-inclination-estimation-using-simulated-data.png)

**상보필터**는 **고주파 노이즈를 가진 가속도** 값과 **저주파 노이즈를 가진 자이로** 값을 종합하여 각도를 계산합니다.

```cpp
#define ALPHA 0.96

float angle_x = 0;

angle_x = ALPHA * (angle_x + gx * dt) + (1 - ALPHA) * angle_ax;
```

`ALPHA`는 자이로 값과 가속도 값의 **반영 비율**입니다.

일반적으로는 `0.96`을 사용하는데, **저주파 노이즈가 잡히지 않는다**면 `ALPHA` 값을 내려서 가속도 값의 비중을 늘리면 됩니다.

상보 필터는 **설계가 간단**하여 **연산량이 적기** 때문에 성능이 낮은 **MCU** 등에서 주로 사용하게 됩니다.

참고: [A Fast and Robust Algorithm for Orientation Estimation Using Inertial Sensors](https://www.researchgate.net/publication/336097733_A_Fast_and_Robust_Algorithm_for_Orientation_Estimation_Using_Inertial_Sensors)

참고: [Mission Planning and Waypoint Navigation of a Micro Quad Copter by Selectable GPS Co-Ordinates](https://www.researchgate.net/publication/265915080_C_2014_IJARCSSE_All_Rights_Reserved_Mission_Planning_and_Waypoint_Navigation_of_a_Micro_Quad_Copter_by_Selectable_GPS_Co-Ordinates)
