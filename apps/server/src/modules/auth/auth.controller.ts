import { Controller, Post, Body, HttpCode, HttpStatus, UploadedFile, UseInterceptors, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { LoginUserDto } from './dto/auth.login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService , 
        private readonly configEnv : ConfigService
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(NoFilesInterceptor())
    async login(
        @Body() loginData : LoginUserDto
    ){
        console.log(loginData?.id)

        try{
            this.authService.tryLogin(loginData.id , loginData.password);
        }
        catch(e){

        }
        

        throw new NotFoundException('ss');
        return { 
            tes : true , 
            env : this.configEnv.get<string>('NODE_ENV'),
            db_host : this.configEnv.get<string>('db.mysql.host')
        };
    }


    // @Post('login')
    // @HttpCode(HttpStatus.OK)
    // async login(@Body() loginDto: LoginDto) {
    //     return this.authService.login(loginDto);
    // }

    // @Post('register')
    // @HttpCode(HttpStatus.CREATED)
    // async register(@Body() registerDto: RegisterDto) {
    //     return this.authService.register(registerDto);
    // }
}