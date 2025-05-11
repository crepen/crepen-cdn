import { Controller, Post, Body, HttpCode, HttpStatus, UploadedFile, UseInterceptors, NotFoundException, Put, UseGuards, Req, Get, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AuthLoginDto } from './dto/login.dto';
import { AuthJwtGuard } from 'src/config/passport/jwt-guard';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entity/user.entity';
import { JwtUserPayload, JwtUserRequest } from 'src/config/passport/interface/jwt';
import { BaseResponse } from 'src/common/base-response';
import { TokenDto } from './dto/jwt.dto';
import { UserService } from '../user/user.service';
import { UserDataDto } from '../user/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configEnv: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService
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
        @Body() loginData: AuthLoginDto
    ) {
        const token: TokenDto = await this.authService.getToken(loginData.id, loginData.password);

        // throw new NotFoundException('ss');
        return BaseResponse.ok(token);
    }


    @Post('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard)
    async tokenRefresh(
        @Req() req: JwtUserRequest,
    ) {

        const tokenDto: TokenDto = await this.authService.tokenRefresh(req.user.payload);

        return BaseResponse.ok(tokenDto);
    }





}