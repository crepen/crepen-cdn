import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtUserRequest } from "src/interface/jwt";
import { BaseResponse } from "src/lib/util/base.response";
import { ConfigService } from "@nestjs/config";
import { CrepenAuthJwtGuard } from "src/config/passport/jwt/jwt.guard";
import { CrepenUserRouteService } from "./user.service";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AddUserDto, ReadUserDto, UpdateUserDto } from "./dto/user.common.dto";

@ApiTags('사용자 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko'] 
})
@Controller('user')
export class CrepenUserRouteController {
    constructor(
        private readonly userService: CrepenUserRouteService,
        private readonly configService: ConfigService
    ) { }


    @Get()
    //#region Decorator
    @ApiOperation({ summary: '사용자 데이터 조회', description: '로그인된 사용자 데이터 조회' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion Decorator
    async getUserData(
        @Req() req: JwtUserRequest
    ) {


        return BaseResponse.ok<ReadUserDto>({
            user: req.user.entity
        });
    }


    @Put()
    //#region Decorator
    @ApiOperation({ summary: '사용자 데이터 수정', description: '로그인된 사용자 데이터 수정' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion Decorator
    async updateUserData(
        @Req() req: JwtUserRequest,
        @Body() bodyData: UpdateUserDto
    ) {
        await this.userService.updateUser(req.user.entity.uid ,bodyData)

        return BaseResponse.ok();
    }


    @Post()
    //#region Decorator
    @ApiOperation({ summary: '사용자 데이터 생성', description: '로그인된 사용자 데이터 생성' })
    @HttpCode(HttpStatus.OK)
    //#endregion Decorator
    async addUserData(
        @Req() req: Request,
        @Body() bodyData: AddUserDto
    ) {

        await this.userService.addUser(bodyData);

        return BaseResponse.ok();
    }
}