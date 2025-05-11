import { Controller, Body, HttpCode, HttpStatus, Put, Post, UseGuards, Req, HttpException } from '@nestjs/common';
import { UserSignUpDto } from './dto/signup.dto';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/update.dto';
import { AuthJwtGuard } from 'src/config/passport/jwt-guard';
import { JwtUserRequest } from 'src/config/passport/interface/jwt';
import { BaseResponse } from 'src/common/base-response';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }



    /**
     * 가입
     * 
     * @param userData 
     */
    @Put()
    @HttpCode(HttpStatus.OK)
    async signUp(@Body() userData: UserSignUpDto) {

        await this.userService.addUser(userData);


        return {
            status: true
        }
    }


    /**
     * 회원정보 변경
     * 
     * @param req 
     * @param userData 
     * @returns 
     */
    @Post()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard)
    async updateUser(
        @Req() req: JwtUserRequest,
        @Body() userData: UserUpdateDto
    ) {

        console.log(req.user)
        return BaseResponse.ok(undefined)
    }
}