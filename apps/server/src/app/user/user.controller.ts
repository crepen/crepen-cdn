import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { JwtUserRequest } from "src/interface/jwt";
import { BaseResponse } from "src/lib/util/base.response";
import { ConfigService } from "@nestjs/config";
import { CrepenAuthJwtGuard } from "src/config/passport/jwt/jwt.guard";
import { CrepenUserRouteService } from "./user.service";

@Controller('user')
export class CrepenUserRouteController {
    constructor(
        private readonly userService: CrepenUserRouteService,
        private readonly configService : ConfigService
    ) { }


    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    async getUserData(
        @Req() req : JwtUserRequest
    )
    {
        console.log(this.configService);

        return BaseResponse.ok();
    }
}