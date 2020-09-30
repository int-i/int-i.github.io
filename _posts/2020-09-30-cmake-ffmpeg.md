---
title: "CMake에서 FFmpeg 라이브러리 가져오기"
date: 2020-09-30
author: Astro36
category: cpp
tags: [c, cpp, linux, ubuntu, gcc, windows, msvc, cmake, ffmpeg, vcpkg]
---

이 글을 컴퓨터에 FFmpeg 라이브러리가 설치되어 있다는 것을 전제로 설명합니다.

만약 라이브러리가 설치되어있지 않다면 스크롤을 내려 FFmpeg 라이브러리를 먼저 설치해주세요.

CMake에서 FFmpeg를 불러오기 위해서는 아래 코드를 `CMakeLists.txt`에 추가합니다.

`CMakeLists.txt`:

```txt
find_path(AVCODEC_INCLUDE_DIR libavcodec/avcodec.h)
find_library(AVCODEC_LIBRARY avcodec)

find_path(AVFORMAT_INCLUDE_DIR libavformat/avformat.h)
find_library(AVFORMAT_LIBRARY avformat)

find_path(AVUTIL_INCLUDE_DIR libavutil/avutil.h)
find_library(AVUTIL_LIBRARY avutil)

target_include_directories(${PROJECT_NAME} PRIVATE ${AVCODEC_INCLUDE_DIR} ${AVFORMAT_INCLUDE_DIR} ${AVUTIL_INCLUDE_DIR})
target_link_libraries(${PROJECT_NAME} PRIVATE ${AVCODEC_LIBRARY} ${AVFORMAT_LIBRARY} ${AVUTIL_LIBRARY})
```

- 참고: [find_path](https://cmake.org/cmake/help/latest/command/find_path.html)
- 참고: [find_library](https://cmake.org/cmake/help/latest/command/find_library.html)
- 참고: [CMakeLists.txt](https://github.com/iamlow/ffmpeg-exam/blob/master/libavformat/CMakeLists.txt)

## 번외: FFmpeg 라이브러리 설치하기

### Ubuntu

```txt
sudo apt update
sudo apt install libavcodec-dev libavformat-dev libavformat-dev
```

### Windows

[Vcpkg](https://github.com/microsoft/vcpkg)를 이용하는 방식이 가장 편리합니다.

Vcpkg를 다운로드해서 설치하는 방법은 [Windows 10에서 Vcpkg를 이용해 Boost 라이브러리 설치하기](https://int-i.github.io/cpp/2020-07-22/vcpkg-boost/)를 참고하세요.

```txt
$ ./vcpkg install ffmpeg:x64-windows
```

> 정적 라이브러리는 `ffmpeg:x64-windows-static`으로 설치하면 됩니다.

```txt
$ ./vcpkg list
...
ffmpeg:x64-windows                                 4.2#23           a library to decode, encode, transcode, mux, dem...
ffmpeg[avcodec]:x64-windows                                         Codec support in ffmpeg
ffmpeg[avdevice]:x64-windows                                        Device support in ffmpeg
ffmpeg[avfilter]:x64-windows                                        Filter support in ffmpeg
ffmpeg[avformat]:x64-windows                                        Format support in ffmpeg
ffmpeg[avresample]:x64-windows                                      Libav audio resampling library support in ffmpeg
ffmpeg[postproc]:x64-windows                                        Postproc support in ffmpeg
ffmpeg[swresample]:x64-windows                                      Swresample support in ffmpeg
ffmpeg[swscale]:x64-windows                                         Swscale support in ffmpeg
...
```

목록에 ffmpeg가 나오면 FFmpeg가 잘 설치된 것입니다.

만약 CMake에서 계속 FFmpeg를 찾지 못하면 `-DCMAKE_TOOLCHAIN_FILE` 옵션을 확인해보세요.
