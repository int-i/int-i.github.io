---
title: "ModelSim 학생 라이센스 발급 실패(Reject) 해결방법"
date: 2020-09-08
author: Astro36
category: hardware
tags: [hardware, circuit, verilog, modelsim, student_license]
---

먼저 [ModelSim PE Student Edition](https://www.mentor.com/company/higher_ed/modelsim-student-edition)에서 'Download Student Edition'을 클릭해 학생용 버전을 다운로드한다.

다운로드한 파일의 설치가 끝나면 최종적으로 학생용 라이센스를 발급받기 위해 [http://portal.mentor.com/d/license_request.asp](http://portal.mentor.com/d/license_request.asp)로 인터넷 익스플로러 창이 열린다.

![License Request Page Screenshot](/assets/posts/2020-09-08-modelsim-student-license/license_request.png)

여기서 주의할 점은 이 **창을 절때 끄면 안 된다**는 것이다.

만약 인터넷 창을 닫고, [http://portal.mentor.com/d/license_request.asp](http://portal.mentor.com/d/license_request.asp) 주소로 직접 들어가서 정보를 입력하게 되면 아래 화면과 같이 라이센스 발급이 거부된다.

![License Reject Page Screenshot](/assets/posts/2020-09-08-modelsim-student-license/license_reject.png)

"Thank you" 덕분에 얼핏 보면 라이센스 발급에 조금 시간이 걸리니 기다리는 것처럼 보이지만, 주소를 보면 [http://portal.mentor.com/d/license_reject.asp](http://portal.mentor.com/d/license_reject.asp?version_required=PE_EDU10.4a&student_version=)로 라이센스가 거부됐다고 나온다.

설치 직후 나오는 인터넷 익스플로러 창을 실수로 닫아버렸다면, ModelSim을 재설치해서 라이센스 화면을 다시 열어야 한다.

![Email License Screenshot](/assets/posts/2020-09-08-modelsim-student-license/email.png)

정상적으로 학생 라이센스가 발급됐다면 거의 바로(5분 내) 입력한 이메일 라이센스가 전송된다.
