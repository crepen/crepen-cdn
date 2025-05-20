import { Controller, Post, Body, HttpCode, HttpStatus, UseInterceptors, UseGuards, Req, Get, Query, Headers, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AuthLoginDto } from './dto/login.dto';
import { AuthJwtGuard } from 'src/config/passport/jwt/jwt.guard';
import { JwtUserRequest } from 'src/common/interface/jwt';
import { BaseResponse } from 'src/common/base-response';
import { TokenDto } from './dto/jwt.dto';
import { UserDataDto } from '../user/dto/user.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TokenType } from './interface/token';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }


    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard)
    async getUserData(
        @Req() req: JwtUserRequest
    ) {
        return BaseResponse.ok(new UserDataDto(req.user.entity));
    }




    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(NoFilesInterceptor())
    async login(
        @Req() req: Request,
        @Headers('Accept-Language') acceptLanguage : string,
        @Body() loginData: AuthLoginDto,
        @I18n() i18n : I18nContext
    ) {
       
        const token: TokenDto = await this.authService.getToken(loginData.id, loginData.password);

        // throw new NotFoundException('ss');
        return BaseResponse.ok(token);
    }


    @Post('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('refresh_token'))
    async tokenRefresh(
        @Req() req: JwtUserRequest,
    ) {

        const tokenDto: TokenDto = await this.authService.tokenRefresh(req.user.payload);

        return BaseResponse.ok(tokenDto);
    }


    @Get('token/exp')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "토큰 만료 체크", description: 'Access Token / Refresh Token 만료 체크' })
    @ApiQuery({ name: 'type', enum : ['access_token' , 'refresh_token'] })
    @ApiBearerAuth('token')
    @ApiParam({
        name: 'Authorization',
        required: false
    })
    async checkTokenExpire(
        @Query('type') type: TokenType,
        @Headers('Authorization') token?: string
    ) {
        const isExpired = await this.authService.isTokenExpired(token, type);

        return BaseResponse.ok({
            expired : isExpired
        });
    }



}