import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { CrepenAuthRouteService } from "./auth.service";
import { CrepenTokenGroup, CrepenTokenType, JwtUserRequest } from "src/interface/jwt";
import { BaseResponse } from "src/lib/util/base.response";
import { ConfigService } from "@nestjs/config";
import { CrepenAuthJwtGuard } from "src/config/passport/jwt/jwt.guard";
import { NoFilesInterceptor } from "@nestjs/platform-express";
import { I18n, I18nContext } from "nestjs-i18n";
import { AuthLoginRequestDto, AuthTokenResponseDto } from "./dto/auth.login.dto";
import { AuthUserDataResponseDto } from "./dto/auth.user.dto";
import { ApiOperation, ApiQuery, ApiBearerAuth, ApiParam, ApiTags, ApiHeader, ApiResponse } from "@nestjs/swagger";
import { EncryptUtil } from "@crepen-nest/lib/util/encrypt.util";

@ApiTags('인증 관리 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('auth')
export class CrepenAuthRouteController {
    constructor(
        private readonly authService: CrepenAuthRouteService,
        private readonly configService: ConfigService
    ) { }


    @Post('login')
    //#region Decorator
    @ApiOperation({ summary: "로그인 (토큰 발급)", description: 'ID or email/Password를 사용한 토큰 발급' })
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(NoFilesInterceptor())
    //#endregion
    async login(
        @Req() req: Request,
        @Body() loginData: AuthLoginRequestDto,
        @I18n() i18n: I18nContext
    ) {
        const token: CrepenTokenGroup = await this.authService.getToken(loginData.id, loginData.password);

        // throw new NotFoundException('ss');
        return BaseResponse.ok<AuthTokenResponseDto>({
            accessToken: token.accessToken.value,
            refreshToken: token.refreshToken.value,
            expireTime: token.refreshToken.expireTime
        });
    }


    @Post('token')
    //#region Decorator
    @ApiOperation({ summary: "토큰 재발급", description: 'Refresh Token을 사용한 토큰 재발급' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('refresh_token'))
    //#endregion
    async tokenRefresh(
        @Req() req: JwtUserRequest,
    ) {

        const token: CrepenTokenGroup = await this.authService.tokenRefresh(req.user.payload);

        return BaseResponse.ok<AuthTokenResponseDto>({
            accessToken: token.accessToken.value,
            refreshToken: token.refreshToken.value,
            expireTime: token.refreshToken.expireTime
        });
    }


    @Get('token/exp')
    //#region Decorator
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "토큰 만료 체크", description: 'Access Token / Refresh Token 만료 체크' })
    @ApiQuery({ name: 'type', enum: ['access_token', 'refresh_token'] })
    @ApiBearerAuth('token')
    @UseGuards(CrepenAuthJwtGuard)
    //#endregion
    async checkTokenExpire() {

        // 토큰 만료는 Auth Guard에서 처리하게끔 설정

        return BaseResponse.ok({
            expired: false
        });
    }


    
}