UNIBERS LEAGUE 서버

1. Node.js가 설치된 환경에서 이 폴더를 엽니다.
2. 터미널에서:
   npm install
3. 관리자 비밀번호 설정:
   ADMIN_PASSWORD=원하는비밀번호
   SESSION_SECRET=아주긴랜덤문자열
4. 실행:
   npm start

기본 테스트 비밀번호는 1234입니다.
공개 배포 전 반드시 ADMIN_PASSWORD와 SESSION_SECRET을 바꾸세요.

서버 API:
POST /api/login
POST /api/logout
GET  /api/me
GET  /api/results
POST /api/results   (관리자 전용)
DELETE /api/results/:round/:home/:away (관리자 전용)

주의:
현재 결과 저장은 서버 메모리에 저장됩니다.
서버가 재시작되면 경기 결과가 초기화됩니다.
영구 저장이 필요하면 SQLite/PostgreSQL 등의 DB를 추가해야 합니다.
