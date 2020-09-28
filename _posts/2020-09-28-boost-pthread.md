---
title: "Boost: undefined reference to symbol pthread_condattr_setclock"
date: 2020-09-28
author: Astro36
category: cpp
tags: [c, cpp, linux, ubuntu, gcc, boost, asio, thread, pthread, cmake]
---

Windows에서 정상적으로 컴파일되던 코드가 리눅스에서는 컴파일 오류가 발생하는 경우가 있습니다.

```txt
/usr/bin/ld: CMakeFiles/project.dir/network.cpp.o: undefined reference to symbol 'pthread_condattr_setclock@@GLIBC_2.3.3'
/usr/bin/ld: /lib/x86_64-linux-gnu/libpthread.so.0: error adding symbols: DSO missing from command line
collect2: error: ld returned 1 exit status
make[2]: *** [src/CMakeFiles/project.dir/build.make:120: src/project] Error 1
make[1]: *** [CMakeFiles/Makefile2:94: src/CMakeFiles/project.dir/all] Error 2
make: *** [Makefile:84: all] Error 2
```

위는 pthread와 관련된 오류 메세지입니다.

Boost를 사용하는 경우, thread와 관련된 코드를 이용할 때 `COMPONENTS`로 thread를 직접 불러와야 리눅스에서 컴파일 오류가 발생하지 않습니다.

```txt
find_package(Boost 1.69 REQUIRED COMPONENTS system thread)
target_include_directories(${PROJECT_NAME} PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(${PROJECT_NAME} PRIVATE ${Boost_LIBRARIES})
```

Boost의 `thread`는 운영체제에 맞춰 스레드 라이브러리를 불러옵니다.
윈도우는 win32의 스레드, 리눅스는 [pthread](https://ko.wikipedia.org/wiki/POSIX_스레드)를 가져옵니다.

`Boost::thread`는 자동으로 `Threads::Threads`를 불러오기 때문에 스레드 라이브러리르 불러오는 코드를 또 작성할 필요는 없습니다.

참고: [FindBoost](https://github.com/Kitware/CMake/blob/master/Modules/FindBoost.cmake)
