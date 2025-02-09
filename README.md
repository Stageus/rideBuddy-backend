# 🚴 rideBuddy-backend
rideBuddy는 지도상의 위치를 기반으로 라이딩에 관련된 정보를 제공하는 웹앱입니다. 
## 📌 주요기능
  * 현재 지도상의 위치 기준으로 현재날씨와 미세먼지 정보를 제공합니다.
  * 행정안전부에 등록된 전국 자전거길 정보를 제공합니다.
  * 행정안전부에 등록된 전국 자전거길인증센터 정보를 제공합니다.
  * 등록된 자전거길과 인증센터에 좋아요를 표시하고 관리할수 있습니다.
  * 개인 계정에 사진을 올리고 관리할 수 있습니다.
## 📌 개발환경
  * 프론트엔드 :
  * 백엔드 : Express.js
  * 언어 : javascript
  * 데이터베이스 : postgresql, mongoDB
  * 배포환경 : AWS EC2
  * 백그라운드 프로세스 : PM2
  * 스토리지 : AWS S3
  * 서드파티 라이브러리 : 네이버지도 API, 에어코리아 및 기상청 공공데이터
  * Auth : JWT/OAuth2.0 네이버,구글
## 📌 팀 멤버
정이령|현기윤|이태준
---|---|---|
PM/백엔드 개발|프론트엔드 개발|백엔드 개발
[@JungYiryung](https://github.com/JungYiryung)||[@jonny0323](https://github.com/jonny0323)
## 📌 프로젝트 구조
* 메인프로젝트 : rideBuddy 기능을 위한 프로젝트
```
src
 ┣ api  
 ┃ ┣ info  
 ┃ ┃ ┣ repository.js         
 ┃ ┃ ┣ route.js
 ┃ ┃ ┗ service.js
 ┃ ┣ mypages #
 ┃ ┃ ┣ repository.js
 ┃ ┃ ┣ route.js
 ┃ ┃ ┗ service.js
 ┃ ┣ users
 ┃ ┃ ┣ middleware
 ┃ ┃ ┃ ┣ checkMailStatus.js
 ┃ ┃ ┃ ┗ verifyMailToken.js
 ┃ ┃ ┣ utility
 ┃ ┃ ┃ ┣ mail.js
 ┃ ┃ ┃ ┗ naverOauth.js
 ┃ ┃ ┣ repository.js
 ┃ ┃ ┣ route.js
 ┃ ┃ ┗ service.js
 ┃ ┗ weather
 ┃ ┃ ┣ repository.js
 ┃ ┃ ┣ route.js
 ┃ ┃ ┗ service.js
 ┣ config
 ┃ ┣ email.js
 ┃ ┣ mongodb.js
 ┃ ┗ postgresql.js
 ┣ middleware
 ┃ ┣ logger.js
 ┃ ┣ validateRegx.js
 ┃ ┗ verifyLoginToken.js
 ┣ utility
 ┃ ┣ customError.js
 ┃ ┣ generateToken.js
 ┃ ┣ multer.js
 ┃ ┣ randomNumber.js
 ┃ ┣ regx.js
 ┃ ┣ verifyJWT.js
 ┃ ┗ wrapper.js
 ┗ .DS_Store
```
* 백그라운드 프로젝트 : 공공api를 통해 기상정보를 db에 저장하는 프로젝트 
```
src
 ┣ config
 ┃ ┗ postgresql.js
 ┣ utility
 ┃ ┗ nowTime.js
 ┣ module.js
 ┗ repository.js
```
## 📌 API 목록
1. 사용자 USERS API

Method|End Point| Description
---|---|---|
GET|/users/login/locasl|로컬 로그인
POST|/users/login/naver|네이버 로그인
POST|/users/login/google|구글 로그인
GET|/users/find-id|아이디 찾기
POST|/users/mail|메일 인증코드 발송(회원가입시)
POST|/users/mail/withId|메일 인증코드 발송(비밀번호 변경시)
GET|/users/mail/check|메일 인증 검증 완료
PUT|/users/change-pw|비밀번호 변경
PUT|/users/change-pw/mypages|마이페이지에서 비밀번호 변경
POST|/users/register|회원가입
GET|/users/duplicate-id|아이디 중복 체크
GET|/users/duplicate-mail|메일 중복 체크
DELETE|/users/my|회원탈퇴하기
* * *
2. 정보관련 INFO API

Method|End Point| Description
---|---|---|
GET|/info/roads|국토종주 자전거길 리스트 출력
GET|/info/centers|자전거 인증센터 리스트 출력
GET|/info|엔터시 검색결과 출력
PUT|/info/roads/:roadIdx/like|자전거길 좋아요
PUT|/info/centers/:centerIdx/like|인증센터 좋아요
GET|/info/roads/:roadPointIdx|자전거길 상세정보 출력
GET|/info/centers/:centerIdx|인증센터 상세정보 출력
GET|/info/search|연관검색어 출력
GET|/info/centers/:centerIdx/position|검색결과 클릭시 해당지도 위치 반환
GET|/info/roads/:roadPointIdx/position|겸색결과 클릭시 해당지도 위치 반환
GET|/info/pin|지도범위내의 인증센터 및 자전거길 정보전달
* * *
3. 기상정보 WEATHER API

Method|End Point| Description
---|---|---|
GET|/weather|미세먼지, 날씨정보 불러오기
* * *
4. 마이페이지 MYPAGES API

Method|End Point| Description
---|---|---|
GET|/mypages|내 정보 불러오기
POST|/mypages/profile|프로필 사진 업로드
GET|/mypages/profile/list|프로필 히스토리 불러오기
DELETE|/mypages/profile|프로필 사진 삭제
GET|/mypages/roads/like-list|좋아요한 국토종주길 출력
GET|/mypages/centers/like-list|좋아요한 인증센터 출력
