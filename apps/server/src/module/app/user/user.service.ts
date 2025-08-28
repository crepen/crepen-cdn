import { Injectable } from "@nestjs/common";
import { CrepenUserRepository } from "./user.repository";
import { UserDuplicateIdError } from "@crepen-nest/lib/error/api/user/duplicate_id.user.error";
import { UserDuplicateEmailError } from "@crepen-nest/lib/error/api/user/duplicate_email.user.error";
import { CryptoUtil, StringUtil } from "@crepen-nest/lib/util";
import { UserInvalidatePasswordError } from "@crepen-nest/lib/error/api/user/validate_password.user.error";
import { UserInvalidateIdError } from "@crepen-nest/lib/error/api/user/validate_id.user.error";
import { randomUUID } from "crypto";
import { UserStateEnum } from "./enum/user-state.enum";
import { UserRoleEnum } from "./enum/user-role.enum";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { UserEntity } from "./entity/user.default.entity";
import * as nodeMailer from 'nodemailer'
import { SendResetPasswordMailFailed } from "@crepen-nest/lib/error/api/user/send_email.user.error";
import { CheckUserValueValidateCategory } from "./types/validate-add-value.user";
import { CommonError } from "@crepen-nest/lib/error/common.error";
import { I18nContext } from "nestjs-i18n";
import { UserInvalidateEmailError } from "@crepen-nest/lib/error/api/user/validate_email.user.error";
import { CrepenUserValidateService } from "./validate.user.service";
import { UserInvalidateNameError } from "@crepen-nest/lib/error/api/user/validate_name.user.error";
import { UserEditCategory } from "./dto/edit-data.user.request";
import { UserSupportLanguageEnum } from "./enum/user-language.enum";

@Injectable()
export class CrepenUserService {
    constructor(
        private readonly userRepo: CrepenUserRepository,
        private readonly userValidService: CrepenUserValidateService
    ) { }

    validateAddUserInfo = async (checkOptions: CheckUserValueValidateCategory[], i18n: I18nContext, originUserData: UserEntity | undefined, userId?: string, userPassword?: string, userName?: string, userEmail?: string, options?: RepositoryOptions) => {

        const validateResult = {
            id: undefined,
            password: undefined,
            name: undefined,
            email: undefined
        }

        // Check ID
        if (checkOptions.find(x => x === 'id')) {
            try {


                if (!this.userValidService.isValidateUserId(userId)) {
                    throw new UserInvalidateIdError();
                }
                else if (originUserData?.accountId?.trim() !== userId?.trim() && await this.userValidService.isDuplicateUserId(userId)) {
                    throw new UserDuplicateEmailError();
                }
            }
            catch (e) {
                if (e instanceof CommonError) {
                    validateResult.id = e.getLocaleMessage();
                }
                else {
                    validateResult.id = i18n.t('common.INTERNAL_SERVER_ERROR');
                }

            }
        }

        // Check Password
        if (checkOptions.find(x => x === 'password')) {
            try {
                if (!this.userValidService.isValidateUserPassword(userPassword)) {
                    throw new UserInvalidatePasswordError();
                }
            }
            catch (e) {

                if (e instanceof CommonError) {
                    validateResult.password = e.getLocaleMessage();
                }
                else {
                    validateResult.password = i18n.t('common.INTERNAL_SERVER_ERROR');
                }

            }
        }

        // Check Email
        if (checkOptions.find(x => x === 'email')) {
            try {
                if (!this.userValidService.isValidateUserEmail(userEmail)) {
                    throw new UserInvalidateEmailError();
                }
                else if (originUserData?.email?.trim() !== userEmail?.trim() && await this.userValidService.isDuplicateUserEmail(userEmail)) {
                    throw new UserDuplicateEmailError();
                }
            }
            catch (e) {
                if (e instanceof CommonError) {
                    validateResult.email = e.getLocaleMessage();
                }
                else {
                    validateResult.email = i18n.t('common.INTERNAL_SERVER_ERROR');
                }
            }
        }

        if (checkOptions.find(x => x === 'name')) {
            try {
                if (!this.userValidService.isValidateUserName(userName)) {
                    throw new UserInvalidateNameError();
                }
            }
            catch (e) {
                if (e instanceof CommonError) {
                    validateResult.name = e.getLocaleMessage();
                }
                else {
                    validateResult.name = i18n.t('common.INTERNAL_SERVER_ERROR');
                }
            }
        }

        return validateResult;
    }


    addUser = async (userId: string, userPassword: string, userName: string, userEmail: string, options?: RepositoryOptions) => {

        if (!this.userValidService.isValidateUserId(userId)) {
            throw new UserInvalidateIdError();
        }
        else if (!this.userValidService.isValidateUserPassword(userPassword)) {
            throw new UserInvalidatePasswordError();
        }
        else if (!this.userValidService.isValidateUserName(userName)) {
            throw new UserInvalidateNameError();
        }
        else if (!this.userValidService.isValidateUserEmail(userEmail)) {
            throw new UserInvalidateEmailError();
        }
        else if (await this.userValidService.isDuplicateUserId(userId)) {
            throw new UserDuplicateIdError();
        }
        else if (await this.userValidService.isDuplicateUserEmail(userEmail)) {
            throw new UserDuplicateEmailError();
        }
   
        const cryptPassword = await CryptoUtil.Hash.encrypt(userPassword);

        const addUser = await this.userRepo.addUser({
            accountId: userId,
            accountPassword: cryptPassword,
            email: userEmail,
            name: userName,
            uid: randomUUID(),
            isLock: false,
            accountState: UserStateEnum.UNAPPROVED
        }, options)

        const addUserRole = await this.userRepo.addUserRole(addUser.uid, UserRoleEnum.ROLE_USER, options);

        return addUser;
    }


    getUserByIdOrEmail = async (userIdOrEmail: string) => {
        return this.userRepo.getOneUser([
            {
                accountId: userIdOrEmail
            },
            {
                email: userIdOrEmail
            }
        ])
    }

    getUserByEmail = async (email: string) => {
        return this.userRepo.getOneUser({
            email: email
        })
    }

    getUserById = async (userId: string) => {
        return this.userRepo.getOneUser({
            accountId: userId
        })
    }

    getUserByUid = async (userUid: string) => {
        return this.userRepo.getOneUser({
            uid: userUid
        })
    }


    findIdOrPassword = async (findCategory: 'id' | 'password', matchIdOrEmail?: string, resetUrl?: string, options?: RepositoryOptions) => {

        const urlJoin = await import('url-join').then(mod => mod.default);

        let matchUser: UserEntity = undefined;

        if (findCategory === 'id') {
            matchUser = await this.getUserByEmail(matchIdOrEmail);
        }
        else if (findCategory === 'password') {
            matchUser = await this.getUserByIdOrEmail(matchIdOrEmail);
        }


        if (matchUser) {

            const resetPasswordUid = randomUUID();

            try {
                if (findCategory === 'password') {
                    await this.userRepo.addResetPasswordHistory({ hours: 24 }, matchUser.uid, resetPasswordUid, options)
                }

                const transporter = nodeMailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'demo.crepen@gmail.com',
                        pass: 'ownmycdlczkqarel'
                    }
                })


                let sendHtml: string = undefined;


                if (findCategory === 'id') {
                    sendHtml = `
                        <!DOCTYPE html>
                        <html lang="ko">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>아이디 요청 - Crepen CDN</title>
                            <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                                    background-color: #f8fafc;
                                    color: #1a1a1a;
                                    line-height: 1.6;
                                }
                                
                                .email-container {
                                    border: 1px solid #efefef;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    background: #ffffff;
                                }
                                
                                .email-header {
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    padding: 40px 20px;
                                    text-align: center;
                                    color: white;
                                }
                                
                                .logo-section {
                                    margin-bottom: 20px;
                                }
                                
                                .logo-icon {
                                    display: inline-block;
                                    width: 60px;
                                    height: 60px;
                                    background: rgba(255, 255, 255, 0.2);
                                    border-radius: 15px;
                                    line-height: 60px;
                                    font-size: 24px;
                                    margin-bottom: 15px;
                                }
                                
                                .email-title {
                                    font-size: 28px;
                                    font-weight: 700;
                                    margin: 0 0 10px 0;
                                }
                                
                                .email-subtitle {
                                    font-size: 16px;
                                    opacity: 0.9;
                                    margin: 0;
                                }
                                
                                .email-body {
                                    padding: 40px 30px;
                                }
                                
                                .greeting {
                                    font-size: 18px;
                                    font-weight: 600;
                                    margin-bottom: 20px;
                                    color: #374151;
                                }
                                
                                .message-text {
                                    font-size: 15px;
                                    color: #6b7280;
                                    margin-bottom: 30px;
                                    line-height: 1.6;
                                }
                                
                                .action-section {
                                    text-align: center;
                                    margin: 40px 0;
                                    padding: 30px;
                                    background: #f8fafc;
                                    border-radius: 16px;
                                    border: 1px solid #e2e8f0;
                                }
                                
                                .action-title {
                                    font-size: 18px;
                                    font-weight: 600;
                                    color: #374151;
                                    margin-bottom: 20px;
                                }
                                
                                .reset-button {
                                    display: inline-block;
                                    background: linear-gradient(135deg, #667eea, #764ba2);
                                    color: white !important;
                                    text-decoration: none;
                                    padding: 18px 32px;
                                    border-radius: 12px;
                                    font-size: 16px;
                                    font-weight: 600;
                                    margin-bottom: 20px;
                                    transition: all 0.3s ease;
                                }
                                
                                .reset-button:hover {
                                    transform: translateY(-2px);
                                    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
                                }
                                
                                .link-text {
                                    font-size: 13px;
                                    color: #6b7280;
                                    margin-top: 15px;
                                }
                                
                                .alternative-link {
                                    word-break: break-all;
                                    color: #667eea;
                                    text-decoration: none;
                                    background: #f1f5f9;
                                    padding: 12px;
                                    border-radius: 8px;
                                    display: block;
                                    margin-top: 10px;
                                    font-size: 13px;
                                }
                                
                                .security-notice {
                                    background: #fffbeb;
                                    border: 1px solid #f59e0b;
                                    border-radius: 12px;
                                    padding: 20px;
                                    margin: 30px 0;
                                }
                                
                                .security-icon {
                                    font-size: 24px;
                                    margin-bottom: 10px;
                                }
                                
                                .security-title {
                                    font-size: 16px;
                                    font-weight: 600;
                                    color: #92400e;
                                    margin-bottom: 10px;
                                }
                                
                                .security-text {
                                    font-size: 14px;
                                    color: #92400e;
                                    line-height: 1.5;
                                }
                                
                                .info-grid {
                                    display: table;
                                    width: 100%;
                                    margin: 30px 0;
                                }
                                
                                .info-row {
                                    display: table-row;
                                }
                                
                                .info-label {
                                    display: table-cell;
                                    padding: 8px 15px 8px 0;
                                    font-weight: 600;
                                    color: #374151;
                                    font-size: 14px;
                                    vertical-align: top;
                                }
                                
                                .info-value {
                                    display: table-cell;
                                    padding: 8px 0;
                                    color: #6b7280;
                                    font-size: 14px;
                                    vertical-align: top;
                                }
                                
                                .divider {
                                    height: 1px;
                                    background: #e5e7eb;
                                    margin: 30px 0;
                                }
                                
                                .help-section {
                                    background: #f0f9ff;
                                    border: 1px solid #0ea5e9;
                                    border-radius: 12px;
                                    padding: 20px;
                                    text-align: center;
                                    margin: 30px 0;
                                }
                                
                                .help-icon {
                                    font-size: 24px;
                                    margin-bottom: 10px;
                                }
                                
                                .help-title {
                                    font-size: 16px;
                                    font-weight: 600;
                                    color: #0c4a6e;
                                    margin-bottom: 10px;
                                }
                                
                                .help-text {
                                    font-size: 14px;
                                    color: #0c4a6e;
                                    margin-bottom: 15px;
                                }
                                
                                .help-contact {
                                    font-size: 14px;
                                    color: #0369a1;
                                    font-weight: 500;
                                }
                                
                                .email-footer {
                                    background: #374151;
                                    color: #d1d5db;
                                    padding: 30px 20px;
                                    text-align: center;
                                    font-size: 13px;
                                }
                                
                                .footer-logo {
                                    margin-bottom: 15px;
                                }
                                
                                .footer-text {
                                    margin-bottom: 10px;
                                    line-height: 1.5;
                                }
                                
                                .footer-links {
                                    margin: 20px 0;
                                }
                                
                                .footer-links a {
                                    color: #9ca3af;
                                    text-decoration: none;
                                    margin: 0 10px;
                                }
                                
                                .footer-links a:hover {
                                    color: #d1d5db;
                                }
                                
                                .unsubscribe {
                                    font-size: 11px;
                                    color: #9ca3af;
                                    margin-top: 20px;
                                }
                                
                                .unsubscribe a {
                                    color: #9ca3af;
                                }
                                
                                /* 모바일 반응형 */
                                @media screen and (max-width: 600px) {
                                    .email-body {
                                        padding: 30px 20px;
                                    }
                                    
                                    .action-section {
                                        padding: 20px 15px;
                                    }
                                    
                                    .reset-button {
                                        padding: 16px 24px;
                                        font-size: 15px;
                                    }
                                    
                                    .info-grid {
                                        display: block;
                                    }
                                    
                                    .info-row {
                                        display: block;
                                        margin-bottom: 15px;
                                    }
                                    
                                    .info-label, .info-value {
                                        display: block;
                                        padding: 2px 0;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <!-- 헤더 섹션 -->
                                <div class="email-header">
                                    <h1 class="email-title">CREPEN CDN</h1>
                                    <p class="email-subtitle">아이디 요청</p>
                                </div>
                                
                                <!-- 본문 섹션 -->
                                <div class="email-body">
                                    <div class="greeting">
                                        안녕하세요, ${matchUser.name}님
                                    </div>
                                    
                                    <div class="message-text">
                                        Crepen CDN 계정의 아이디를 보내드립니다.
                                    </div>
                                    
                                    <!-- 액션 섹션 -->
                                    <div class="action-section">
                                        <div class="action-title">🔐 사용자 계정 아이디</div>
                                        <a href="#" class="alternative-link">${matchUser.accountId}</a>
                                    </div>
                                    
                                  
                                    
                                    <!-- 요청 정보 -->
                                    <div class="info-grid">
                                        <div class="info-row">
                                            <div class="info-label">요청 시간:</div>
                                            <div class="info-value">2025년 8월 24일 오후 3:45</div>
                                        </div>
                                    </div>
                                    

                                    
                                
                                </div>
                                
                                <!-- 푸터 섹션 -->
                                <div class="email-footer">
                                    <div class="footer-logo">
                                        <strong>CREPEN</strong>
                                    </div>
                                    <div class="footer-text">
                                    
                                    </div>
                                    
                                    <div class="footer-links">
                                        <!-- <a href="#">개인정보처리방침</a>
                                        <a href="#">이용약관</a>
                                        <a href="#">고객지원</a>
                                        <a href="#">FAQ</a> -->
                                    </div>
                                    
                                    <div class="unsubscribe">
                                        이 이메일은 Crepen CDN 계정 보안을 위해 발송되었습니다.
                                        <!-- <a href="#">이메일 수신거부</a> | <a href="#">환경설정</a> -->
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                }
                else {
                    sendHtml = `
                        <!DOCTYPE html>
                        <html lang="ko">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>비밀번호 재설정 - Crepen CDN</title>
                            <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                                    background-color: #f8fafc;
                                    color: #1a1a1a;
                                    line-height: 1.6;
                                }
                                
                                .email-container {
                                    border: 1px solid #efefef;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    background: #ffffff;
                                }
                                
                                .email-header {
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    padding: 40px 20px;
                                    text-align: center;
                                    color: white;
                                }
                                
                                .logo-section {
                                    margin-bottom: 20px;
                                }
                                
                                .logo-icon {
                                    display: inline-block;
                                    width: 60px;
                                    height: 60px;
                                    background: rgba(255, 255, 255, 0.2);
                                    border-radius: 15px;
                                    line-height: 60px;
                                    font-size: 24px;
                                    margin-bottom: 15px;
                                }
                                
                                .email-title {
                                    font-size: 28px;
                                    font-weight: 700;
                                    margin: 0 0 10px 0;
                                }
                                
                                .email-subtitle {
                                    font-size: 16px;
                                    opacity: 0.9;
                                    margin: 0;
                                }
                                
                                .email-body {
                                    padding: 40px 30px;
                                }
                                
                                .greeting {
                                    font-size: 18px;
                                    font-weight: 600;
                                    margin-bottom: 20px;
                                    color: #374151;
                                }
                                
                                .message-text {
                                    font-size: 15px;
                                    color: #6b7280;
                                    margin-bottom: 30px;
                                    line-height: 1.6;
                                }
                                
                                .action-section {
                                    text-align: center;
                                    margin: 40px 0;
                                    padding: 30px;
                                    background: #f8fafc;
                                    border-radius: 16px;
                                    border: 1px solid #e2e8f0;
                                }
                                
                                .action-title {
                                    font-size: 18px;
                                    font-weight: 600;
                                    color: #374151;
                                    margin-bottom: 20px;
                                }
                                
                                .reset-button {
                                    display: inline-block;
                                    background: linear-gradient(135deg, #667eea, #764ba2);
                                    color: white !important;
                                    text-decoration: none;
                                    padding: 18px 32px;
                                    border-radius: 12px;
                                    font-size: 16px;
                                    font-weight: 600;
                                    margin-bottom: 20px;
                                    transition: all 0.3s ease;
                                }
                                
                                .reset-button:hover {
                                    transform: translateY(-2px);
                                    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
                                }
                                
                                .link-text {
                                    font-size: 13px;
                                    color: #6b7280;
                                    margin-top: 15px;
                                }
                                
                                .alternative-link {
                                    word-break: break-all;
                                    color: #667eea;
                                    text-decoration: none;
                                    background: #f1f5f9;
                                    padding: 12px;
                                    border-radius: 8px;
                                    display: block;
                                    margin-top: 10px;
                                    font-size: 13px;
                                }
                                
                                .security-notice {
                                    background: #fffbeb;
                                    border: 1px solid #f59e0b;
                                    border-radius: 12px;
                                    padding: 20px;
                                    margin: 30px 0;
                                }
                                
                                .security-icon {
                                    font-size: 24px;
                                    margin-bottom: 10px;
                                }
                                
                                .security-title {
                                    font-size: 16px;
                                    font-weight: 600;
                                    color: #92400e;
                                    margin-bottom: 10px;
                                }
                                
                                .security-text {
                                    font-size: 14px;
                                    color: #92400e;
                                    line-height: 1.5;
                                }
                                
                                .info-grid {
                                    display: table;
                                    width: 100%;
                                    margin: 30px 0;
                                }
                                
                                .info-row {
                                    display: table-row;
                                }
                                
                                .info-label {
                                    display: table-cell;
                                    padding: 8px 15px 8px 0;
                                    font-weight: 600;
                                    color: #374151;
                                    font-size: 14px;
                                    vertical-align: top;
                                }
                                
                                .info-value {
                                    display: table-cell;
                                    padding: 8px 0;
                                    color: #6b7280;
                                    font-size: 14px;
                                    vertical-align: top;
                                }
                                
                                .divider {
                                    height: 1px;
                                    background: #e5e7eb;
                                    margin: 30px 0;
                                }
                                
                                .help-section {
                                    background: #f0f9ff;
                                    border: 1px solid #0ea5e9;
                                    border-radius: 12px;
                                    padding: 20px;
                                    text-align: center;
                                    margin: 30px 0;
                                }
                                
                                .help-icon {
                                    font-size: 24px;
                                    margin-bottom: 10px;
                                }
                                
                                .help-title {
                                    font-size: 16px;
                                    font-weight: 600;
                                    color: #0c4a6e;
                                    margin-bottom: 10px;
                                }
                                
                                .help-text {
                                    font-size: 14px;
                                    color: #0c4a6e;
                                    margin-bottom: 15px;
                                }
                                
                                .help-contact {
                                    font-size: 14px;
                                    color: #0369a1;
                                    font-weight: 500;
                                }
                                
                                .email-footer {
                                    background: #374151;
                                    color: #d1d5db;
                                    padding: 30px 20px;
                                    text-align: center;
                                    font-size: 13px;
                                }
                                
                                .footer-logo {
                                    margin-bottom: 15px;
                                }
                                
                                .footer-text {
                                    margin-bottom: 10px;
                                    line-height: 1.5;
                                }
                                
                                .footer-links {
                                    margin: 20px 0;
                                }
                                
                                .footer-links a {
                                    color: #9ca3af;
                                    text-decoration: none;
                                    margin: 0 10px;
                                }
                                
                                .footer-links a:hover {
                                    color: #d1d5db;
                                }
                                
                                .unsubscribe {
                                    font-size: 11px;
                                    color: #9ca3af;
                                    margin-top: 20px;
                                }
                                
                                .unsubscribe a {
                                    color: #9ca3af;
                                }
                                
                                /* 모바일 반응형 */
                                @media screen and (max-width: 600px) {
                                    .email-body {
                                        padding: 30px 20px;
                                    }
                                    
                                    .action-section {
                                        padding: 20px 15px;
                                    }
                                    
                                    .reset-button {
                                        padding: 16px 24px;
                                        font-size: 15px;
                                    }
                                    
                                    .info-grid {
                                        display: block;
                                    }
                                    
                                    .info-row {
                                        display: block;
                                        margin-bottom: 15px;
                                    }
                                    
                                    .info-label, .info-value {
                                        display: block;
                                        padding: 2px 0;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <!-- 헤더 섹션 -->
                                <div class="email-header">
                                    <h1 class="email-title">CREPEN CDN</h1>
                                    <p class="email-subtitle">비밀번호 재설정 요청</p>
                                </div>
                                
                                <!-- 본문 섹션 -->
                                <div class="email-body">
                                    <div class="greeting">
                                        안녕하세요, ${matchUser.name}님
                                    </div>
                                    
                                    <div class="message-text">
                                        Crepen CDN 계정의 비밀번호 재설정을 요청하셨습니다.<br>
                                        아래 링크를 클릭하여 새로운 비밀번호를 설정해주세요.
                                    </div>
                                    
                                    <!-- 액션 섹션 -->
                                    <div class="action-section">
                                        <div class="action-title">🔐 비밀번호 재설정</div>
                                        <a href="${urlJoin(resetUrl ?? '#', `?uid=${resetPasswordUid}`)}" class="alternative-link">${resetUrl ? urlJoin(resetUrl ?? '#', `?uid=${resetPasswordUid}`) : 'Reset URL Not Defined'}</a>
                                    </div>
                                    
                                    <!-- 보안 안내 -->
                                    <div class="security-notice">
                                        <div class="security-icon">🛡️</div>
                                        <div class="security-title">보안 안내사항</div>
                                        <div class="security-text">
                                            • 이 링크는 <strong>24시간 후</strong> 만료됩니다<br>
                                            • 비밀번호 재설정을 요청하지 않으셨다면 이 이메일을 무시하세요<br>
                                            • 링크를 다른 사람과 공유하지 마세요
                                        </div>
                                    </div>
                                    
                                    <!-- 요청 정보 -->
                                    <div class="info-grid">
                                        <div class="info-row">
                                            <div class="info-label">요청 시간:</div>
                                            <div class="info-value">2025년 8월 24일 오후 3:45</div>
                                        </div>
                                    </div>
                                    

                                    
                                
                                </div>
                                
                                <!-- 푸터 섹션 -->
                                <div class="email-footer">
                                    <div class="footer-logo">
                                        <strong>CREPEN</strong>
                                    </div>
                                    <div class="footer-text">
                                    
                                    </div>
                                    
                                    <div class="footer-links">
                                        <!-- <a href="#">개인정보처리방침</a>
                                        <a href="#">이용약관</a>
                                        <a href="#">고객지원</a>
                                        <a href="#">FAQ</a> -->
                                    </div>
                                    
                                    <div class="unsubscribe">
                                        이 이메일은 Crepen CDN 계정 보안을 위해 발송되었습니다.
                                        <!-- <a href="#">이메일 수신거부</a> | <a href="#">환경설정</a> -->
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                }





                const mailOptions: nodeMailer.SendMailOptions = {
                    from: 'demo.crepen@gmail.com',
                    to: matchUser.email,
                    subject: findCategory === 'id' ? 'Crepen CDN Find ID' : "Crepen CDN Reset Password",
                    html: sendHtml
                }

                const info = await transporter.sendMail(mailOptions);
            }
            catch (e) {
                throw new SendResetPasswordMailFailed();
            }



        }
    }

    getResetPasswordExpireState = async (uid: string, options?: RepositoryOptions) => {
        return this.userRepo.getResetPasswordHistory(uid, options);
    }

    editUserData = async (checkOptions: UserEditCategory[], editUserUid: string, editName?: string, editEmail?: string, editLanguage?: string, options?: RepositoryOptions) => {

        const userData = await this.getUserByUid(editUserUid);


        if (checkOptions.find(x => x === 'name')) {
            if (userData.name.trim() !== editName?.trim()) {

                if (!this.userValidService.isValidateUserName(editName)) {
                    throw new UserInvalidateNameError();
                }

                userData.name = editName?.trim()
            }
        }
        
        if (checkOptions.find(x => x === 'email')) {
           

            if (userData.email.trim() !== editEmail?.trim()) {

                if (!this.userValidService.isValidateUserEmail(editEmail)) {
                    throw new UserDuplicateEmailError();
                }
                else if (await this.userValidService.isDuplicateUserEmail(editEmail)) {
                    throw new UserDuplicateEmailError();
                }



                userData.email = editEmail?.trim()
            }
        }
        
        if (checkOptions.find(x => x === 'language')) {
            if (userData.accountLanguage.trim() !== editLanguage?.trim()) {

                if (editLanguage === 'en' || editLanguage === 'ko') {
                    userData.accountLanguage = editLanguage?.trim() === 'ko'
                        ? UserSupportLanguageEnum.KO
                        : UserSupportLanguageEnum.EN;
                }


            }
        }

        if (checkOptions.length > 0) {
            userData.updateDate = new Date();
        }

        await this.userRepo.editUser(userData, options);
    }
}