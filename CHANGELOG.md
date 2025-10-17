# CREPEN CDN PACKAGE CHANGE LOG

## ℹ️ [0.1.2]

### ✒️ ADDED

####

#### ADMIN (NextJS)
 - 신규 생성



### ✒️ FIXED

#### CRYPT-SERVER (ASP.NET)
 - 동시에 여러 항목 암호화/복호화 시 Database Connect Error 현상 수정
    - Task마다 Scope 생성



## ℹ️ [0.1.1] -

### ✒️ ADDED

#### CLOUD (NextJS)
 - 파일 다운로드 API 구현
   - 내부 다운로드 (Session)
   - 배포 다운로드 (Non-Session)

#### SERVER (NestJS)
 - 

#### CRYPT-SERVER (ASP.NET)
 - 신규 구현
 - Encrypt/Decrypt Scheduler 구현



### ✒️ CHANGED

#### SERVER (NestJS)
 - File Info Encrypt 관련 속성 제거 및 Encrypt 관련 Data Join으로 변경
 - 암호화 GCM으로 변경




### ✒️ DEPRECATED




### ✒️ REMOVED

#### SERVER (NestJS)
 - Encrypt/Decrypt Scheduler 제거 (별도 Crypt Server로 이관)
 - File Info Encrypt 관련 속성 제거



### ✒️ FIXED
 - File Download 시 Chrome에서 미리보기가 불가능한 현상 수정 (Content-Disposition : attechment 제거)




### ✒️ SECURITY



## ℹ️ [0.1.0] 2025.09.01

### ✒️ ADDED

#### COMMON

#### Cloud (NextJS)
 - 파일 조회 페이지 구현
    - 파일 조회 구현
    - 파일 배포/배포 해제 구현
    - 프리뷰 구현
    - Action Publish File Button 구현
    - 로드 경고문구 삽입

#### SERVER
 - 파일 배포 기능 구현

 - 파일 암호화 Queue 구현
 - 파일 암호화 Scheduler 구현


### ✒️ CHANGED

#### SERVER
 - 파일 다운로드 기능 수정
    - 암호화 파일은 Stream Range 적용 불가
 - 파일 암호화 로직 수정

### ✒️ DEPRECATED


### ✒️ REMOVED


### ✒️ FIXED


### ✒️ SECURITY