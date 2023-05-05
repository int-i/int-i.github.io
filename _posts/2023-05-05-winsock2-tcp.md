---
title: "아뢰옵기도 송구한 TCP의 SYN이시여. 삼가 ACK 돌려드립니다! WinSock2를 이용한 TCP 통신"
date: 2023-05-05
author: Astro36
category: cpp
tags: [cpp, c, windows, winsock2, web, socket, tcp, syn, ack, internet_protocol, ip, ipv4]
thumbnail: /assets/posts/2023-05-05-winsock2-tcp/thumbnail.jpg
---

**Winsock2**는 Windows에서 사용되는 **소켓 라이브러리 헤더**입니다.

**소켓**(Socket)은 **네트워크 입/출력**을 통신 창구 역할을 하는 응용 프로토콜 인터페이스를 말합니다.

소켓은 **TCP/IP**와 같은 프로토콜을 사용하여 데이터를 전송합니다.

소켓은 **연결형 서비스**와 **비연결형 서비스**로 나뉘며, **TCP**는 연결형 서비스이고 **UDP**는 비연결형 서비스입니다.

## TCP와 UDP

**TCP**는 연결형 서비스로, 상대방이 데이터를 제대로 전송받았는지 확인합니다.

따라서 **신뢰성**이 보장되지만, UDP에 비해 속도가 **느리다**는 단점이 있습니다.

반면, **UDP**는 비연결형 서비스로, 신뢰성을 포기하고 **빠른 속도**가 필요할 때 사용합니다.

UDP는 상대방이 데이터를 전송받았는지 확인하지 않고 **일방적으로 데이터를 전송**합니다.

예를 들어, **웹 서버**와의 통신을 위한 프로토콜인 **HTTP**(HTTP/1과 HTTP/2)는 **TCP**를 사용합니다.

왜냐하면 사용자에게 보이는 정보가 잘못되면 여러 문제를 일으킬 수 있기 때문입니다.

하지만, 최근에 나온 **HTTP/3**은 TCP 대신 **UDP**를 선택했습니다.

TCP는 정보 검증을 위한 여러 데이터가 포함되어 전송을 하는데, 이 때문에 **헤더의 크기**가 커지게 됩니다.

이는 **전송 속도** 하락으로 이어집니다.

또한, TCP의 **3-way handshake** 역시 **전송 속도** 하락의 원인 중 하나입니다.

이 때문에 **HTTP/3**는 신뢰성을 일부 포기하고 속도를 위해 UDP를 선택하게 되었습니다.

참고: [HTTP/3는 왜 UDP를 선택한 것일까?](https://evan-moon.github.io/2019/10/08/what-is-http3/)

## 소켓 프로그래밍

### TCP 서버

**WinSock2 헤더**를 사용하기 위해서는 `ws2_32.lib` 라이브러리가 필요합니다.

**Visual Studio**에서는 아래와 같이 `#pragma`를 이용해 **라이브러리를 링크**할 수 있습니다.

```cpp
#pragma comment(lib, "ws2_32.lib")
```

이제 필요한 헤더를 불러올 차례입니다.

```cpp
#include <Winsock2.h>
#include <Ws2tcpip.h>
#include <cstring>
#include <iostream>
```

`Ws2tcpip.h`는 문자열(Dotted-Decimal Notation) 형태의 **IPv4 주소를 32 비트 숫자**(네트워크 바이트 정렬)로 반환하는 `inet_pton` 함수 사용을 위해 필요합니다.

`cstring`은 `strlen` 함수 사용을 위해 필요합니다.

`main` 함수를 호출하면 가장 먼저 **WinSock 라이브러리 DLL를 불러와 초기화**해야 합니다.

```cpp
int main() {
    int err;

    WSADATA wsaData;
    if ((err = WSAStartup(MAKEWORD(2, 2), &wsaData)) != 0) { // 지정한 버전의 Winsock DLL을 불러와 초기화
        std::cerr << "WSAStartup failed with error: " << err << '\n';
        WSACleanup(); // Winsock DLL 사용 종료
        return 1;
    }

    // ...

    return 0;
}
```

`MAKEWORD`는 `WORD` 타입의 값을 만드는 **매크로 함수**입니다.

`WORD`는 `unsigned short` 타입과 동일합니다.

`MAKEWORD(2, 2)`는 `0x0202`를 의미하며 **WinSock DLL 2.2 버전**을 불러오라는 의미입니다.

```cpp
std::cout << "socket()\n";
SOCKET servSock = socket(PF_INET, SOCK_STREAM, 0); // 서버 소켓 생성
if (servSock == INVALID_SOCKET) { // 소켓 생성 실패
    std::cerr << "socket function failed with error: " << WSAGetLastError() << '\n'; // WSAGetLastError: 오류 코드 출력
    WSACleanup();
    return 1;
}
```

`socket`은 **소켓을 생성**하는 함수입니다.

`PF_INET`는 **P**rotocol **F**amilty **I**nter**NET**의 줄임말로, **인터넷 프로토콜 IPv4**를 이용하는 것을 의미합니다.

`SOCK_STREAM`은 스트림(Stream) 방식의 소켓을 의미합니다.
`PF_INET`에서는 **TCP**를 의미합니다.

마지막의 `0`은 **프로토콜**입니다.
값이 `0`이면 호출자가 프로토콜을 지정하지 않고 서비스 공급자가 **자동으로 프로토콜을 선택**합니다.
`PF_INET`에서는 `IPPROTO_TCP`가 자동으로 선택됩니다.

```cpp
SOCKADDR_IN servAddr; // 서버 주소 구조체
servAddr.sin_family = AF_INET; // IPv4
inet_pton(AF_INET, "127.0.0.1", &servAddr.sin_addr.s_addr); // loopback ip
servAddr.sin_port = htons(3000); // port

std::cout << "bind(servSock, servAddr)\n";
if (bind(servSock, (SOCKADDR*) &servAddr, sizeof(servAddr)) == SOCKET_ERROR) { // 소켓에 주소 할당
    std::cerr << "bind function failed with error: " << WSAGetLastError() << '\n';
    if (closesocket(servSock) == SOCKET_ERROR) { // 소켓 사용 종료
        std::cerr << "servSock closesocket function failed with error: " << WSAGetLastError() << '\n';
    }
    WSACleanup();
    return 1;
}
```

소켓에 서버 주소를 **bind**합니다.

bind는 **IP주소와 소켓을 매핑**(Mapping)시키는 것을 의미합니다.

`inet_pton`는 **문자열 주소를 32비트 숫자로** 반환하는 함수입니다.

`127.0.0.1`는 **Loopback IP**(루프백 아이피)로 자기 자신을 가리키는 IP입니다.

`htons`는 host to network short라는 의미로, **호스트 바이트 정렬(리틀엔디안)에서 네트워크 바이트 정렬(빅엔디안)으로** 변환하는 함수입니다.
마지막의 short는 데이터가 `short`(16비트 정수) 타입임을 의미합니다.

```cpp
std::cout << "listen(servSock)\n";
if (listen(servSock, SOMAXCONN) == SOCKET_ERROR) { // SOMAXCONN: 최대 연결 대기 중인 소켓 수
    std::cerr << "listen function failed with error: " << WSAGetLastError() << '\n';
    if (closesocket(servSock) == SOCKET_ERROR) {
        std::cerr << "servSock closesocket function failed with error: " << WSAGetLastError() << '\n';
    }
    WSACleanup();
    return 1;
}
```

`listen` 함수를 이용해 **클라이언트가 접속을 시도할 때까지 대기**합니다.

`SOMAXCONN`은 **backlog**로, 최대 연결 대기가능한 소켓 수를 의미합니다.

```cpp
SOCKADDR_IN clntAddr; // 클라이언트 주소 구조체
int clntAddrSz = sizeof(clntAddr);

std::cout << "accept(servSock, clntAddr)\n";
SOCKET clntSock = accept(servSock, (SOCKADDR*) &clntAddr, &clntAddrSz); // 클라이언트 연결 허용
if (clntSock == INVALID_SOCKET) { // 클라이언트 연결 실패
    std::cerr << "accept function failed with error: " << WSAGetLastError() << '\n';
    if (closesocket(clntSock) == SOCKET_ERROR) {
        std::cerr << "clntSock closesocket function failed with error: " << WSAGetLastError() << '\n';
    }
    if (closesocket(servSock) == SOCKET_ERROR) {
        std::cerr << "servSock closesocket function failed with error: " << WSAGetLastError() << '\n';
    }
    WSACleanup();
    return 1;
}
```

`accept` 함수는 **연결된 클라이언트**의 **소켓과 주소**를 반환합니다.

`clntSock`이 **클라이언트 소켓**으로, 해당 소켓 통해 `send`를 하면 클라이언트로 데이터가 전송됩니다.

`clntAddr`에는 **클라이언트 IP 주소**에 대한 정보가 들어있습니다.

```cpp
// 클라이언트가 보낸 메세지를 수신
while (true) {
    int bytes;
    char buf[100];

    std::cout << "recv(clntSock, buf)\n";
    std::cout << "recv: ";
    do {
        bytes = recv(clntSock, buf, 99, 0); // 클라이언트 메세지 수신
        if (bytes == 99) { // buf 크기 이상의 메세지 수신
            buf[bytes] = '\0'; // 마지막 문자를 \0으로
        }
        if (bytes > 0) {
            std::cout << buf; // cout 메세지 출력
            if (buf[bytes - 1] == '\0') { // 메세지 종료
                break;
            }
        } else if (bytes == 0) { // 연결 종료
            std::cout << "Connection closed\n";
            break;
        } else { // 연결 오류
            std::cerr << "recv function failed with error: " << WSAGetLastError() << '\n';
            if (closesocket(clntSock) == SOCKET_ERROR) {
                std::cerr << "clntSock closesocket function failed with error: " << WSAGetLastError() << '\n';
            }
            if (closesocket(servSock) == SOCKET_ERROR) {
                std::cerr << "servSock closesocket function failed with error: " << WSAGetLastError() << '\n';
            }
            WSACleanup();
            return 1;
        }
    } while (bytes > 0);

    std::cout << "\nsend: ";
    std::cin.getline(buf, 99); // cin 입력을 buf에 저장
    std::cout << "send(clntSock, buf)\n";
    if ((bytes = send(clntSock, buf, strlen(buf) + 1, 0)) == SOCKET_ERROR) { // 클라이언트에 buf 전송
        std::cerr << "send function failed with error: " << WSAGetLastError() << '\n';
        if (closesocket(clntSock) == SOCKET_ERROR) {
            std::cerr << "clntSock closesocket function failed with error: " << WSAGetLastError() << '\n';
        }
        if (closesocket(servSock) == SOCKET_ERROR) {
            std::cerr << "servSock closesocket function failed with error: " << WSAGetLastError() << '\n';
        }
        WSACleanup();
        return 1;
    }
}
```

`recv`는 클라이언트가 **전송한 데이터를 받는** 함수입니다.

**반환값**은 수신한 데이터의 **바이트 수** 입니다.

만약 `-1`을 반환하면 **소켓 통신에 오류**가 발생한 것이고, 0을 반환하면 상대방이 `FIN`을 보내 **연결을 종료**한 것입니다.

현재 `buf`에 받아둘 수 있는 **최대 데이터 크기는 99**이기 때문에 100바이트 이상의 데이터가 들어오면 뒷 부분이 잘리게 됩니다.

따라서 `do-while` 문을 이용해 100바이트 이상의 데이터가 들어와도 **남은 데이터를 계속 받을 수 있게** 구현했습니다.

`send`는 클라이언트에 **데이터를 전송**하는 함수입니다.

`buf`에 99바이트까지만 입력되기에, **한 번에 99바이트까지만 전송**할 수 있습니다.

```cpp
if (closesocket(clntSock) == SOCKET_ERROR) {
    std::cerr << "clntSock closesocket function failed with error: " << WSAGetLastError() << '\n';
}
if (closesocket(servSock) == SOCKET_ERROR) {
    std::cerr << "servSock closesocket function failed with error: " << WSAGetLastError() << '\n';
}

WSACleanup();
```

소켓 사용이 끝나면 `closesocket`으로 소켓을 닫아주고, `WSACleanup`으로 WinSock 라이브러리 사용을 종료합니다.

### TCP 클라이언트

클라이언트는 서버와의 **차이점** 위주로 설명하겠습니다.

```cpp
std::cout << "socket()\n";
SOCKET sock = socket(PF_INET, SOCK_STREAM, 0); // 소켓 생성
if (sock == INVALID_SOCKET) { // 소켓 생성 실패
    std::cerr << "socket function failed with error: " << WSAGetLastError() << '\n'; // WSAGetLastError: 오류 코드 출력
    WSACleanup();
    return 1;
}
```

소켓을 만드는 과정은 **서버와 동일**합니다.

```cpp
SOCKADDR_IN servAddr; // 서버 주소 구조체
servAddr.sin_family = AF_INET; // IPv4
inet_pton(AF_INET, "127.0.0.1", &servAddr.sin_addr.s_addr); // loopback ip
servAddr.sin_port = htons(3000); // port

std::cout << "connect(servSock, servAddr)\n";
if (connect(sock, (SOCKADDR*) &servAddr, sizeof(servAddr)) == SOCKET_ERROR) { // 서버에 연결
    std::cerr << "connect function failed with error: " << WSAGetLastError() << '\n';
    if (closesocket(sock) == SOCKET_ERROR) { // 소켓 사용 종료
        std::cerr << "closesocket function failed with error: " << WSAGetLastError() << '\n';
    }
    WSACleanup();
    return 1;
}
```

클라이언트는 서버의 `bind`와 `listen` 과정이 없고, `connect`가 필요합니다.

`connect`는 `bind`되어 `listen`중인 **서버의 소켓에 연결을 요청**하는 함수입니다.

**서버**가 클라이언트의 `connect` 요청을 받으면, 서버의 `accept` 함수가 **클라이언트 소켓**을 반환합니다.

```cpp
// 클라이언트가 먼저 메세지를 전송
while (true) {
    int bytes;
    char buf[100];

    std::cout << "send: ";
    std::cin.getline(buf, 99); // cin 입력을 buf에 저장
    std::cout << "send(sock, buf)\n";
    if ((bytes = send(sock, buf, strlen(buf) + 1, 0)) == SOCKET_ERROR) { // 서버에 buf 전송
        std::cerr << "send function failed with error: " << WSAGetLastError() << '\n';
        if (closesocket(sock) == SOCKET_ERROR) {
            std::cerr << "closesocket function failed with error: " << WSAGetLastError() << '\n';
        }
        WSACleanup();
        return 1;
    }

    std::cout << "recv(sock, buf)\n";
    std::cout << "recv: ";
    do {
        bytes = recv(sock, buf, 99, 0); // 서버 메세지 수신
        if (bytes == 99) { // buf 크기 이상의 메세지 수신
            buf[bytes] = '\0'; // 마지막 문자를 \0으로
        }
        if (bytes > 0) {
            std::cout << buf; // cout 메세지 출력
            if (buf[bytes - 1] == '\0') { // 메세지 종료
                break;
            }
        } else if (bytes == 0) { // 연결 종료
            std::cout << "Connection closed\n";
            break;
        } else { // 연결 오류
            std::cerr << "recv function failed with error: " << WSAGetLastError() << '\n';
            if (closesocket(sock) == SOCKET_ERROR) {
                std::cerr << "closesocket function failed with error: " << WSAGetLastError() << '\n';
            }
            WSACleanup();
            return 1;
        }
    } while (bytes > 0);
    std::cout << '\n';
}
```

`while`은 **서버와 동일**하지만, `send`와 `recv` 순서가 바뀌었습니다.

```cpp
if (closesocket(sock) == SOCKET_ERROR) {
    std::cerr << "closesocket function failed with error: " << WSAGetLastError() << '\n';
}

WSACleanup();
```

사용이 끝나면 **소켓을 닫아**주고 **WinSock 라이브러리를 정리**합니다.

소켓을 2개 닫은 서버와 달리, **클라이언트**에서는 소켓이 하나만 만들어지므로 `closesocket`을 **한 번 호출**합니다.

참고: [윈도우 소켓? 그게 뭔데? 먹는거야? - 인하대학교 인트아이](https://int-i.github.io/cpp/2022-03-24/socket/)

참고: [윈도우 소켓 2편 서버와 클라이언트 - 인하대학교 인트아이](https://int-i.github.io/cpp/2022-04-04/socket-2/)

참고: [윈도우 소켓 3편 채팅 프로그램을 만들어보자! - 인하대학교 인트아이](https://int-i.github.io/cpp/2022-05-10/socket-3/)
