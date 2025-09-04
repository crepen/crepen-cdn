# CREPEN CDN
![crepen-cdn-logo (1)](https://github.com/user-attachments/assets/5d0fa3d7-19a9-473f-894b-9d0104b86b79)

## Demo Site
https://cdn.crepen.cloud

## 설명
Crepen CDN은 소규모 기업에서 이미지 등을 배포하거나 , 폐쇄망 내에서 CDN 서비스를 이용하기 위해 만들어진 플랫폼입니다.
RestAPI로 서버에 접근하여 데이터를 가져올 수 있으며, 파일 암호화/복호화 기능이 있어 특정 파일을 암호화하여 서버에 저장할 수 있습니다.

## 기술
| 서비스 | 사용 기술 | 설명 |
|---------|------|-----|
| Cloud | NextJS 15+ | 사용자 이용 Site |
| Admin | NextJS 15+ | 관리자 초기 설정 및 유지보수용 Site |
| Server | NestJS 11+ | 데이터 관리용 Rest API Server |
| Encrypt Service | ASP.NET Core 9.0+ | 파일 암호화용 별도 Scheduler Server |

## Docker Image

Docker Image로 배포 시, Nexus 로그인 권한이 필요합니다.

| 서비스 | Image |
|-------|------|
| Cloud | nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud |
| Admin | nexus.crepen.cloud/crepencdn-docker/crepen-cdn-admin |
| Server | nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server |
| Encrypt Service | nexus.crepen.cloud/crepencdn-docker/crepen-cdn-encrypt |
 
