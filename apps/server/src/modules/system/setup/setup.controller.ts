import { Controller, Get, Post } from "@nestjs/common";
import { BaseResponse } from "src/common/base-response";

@Controller('system/setup')
export class SystemSetupController {
    constructor() {}

    @Get()
    async getInitState(

    ){
        

        return BaseResponse.ok();
    }
}