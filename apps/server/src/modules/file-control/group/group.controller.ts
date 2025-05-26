import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { BaseResponse } from "src/common/base-response";
import { JwtUserRequest } from "src/common/interface/jwt";
import { AuthJwtGuard } from "src/config/passport/jwt/jwt.guard";
import { GroupService } from "./group.service";
import { AddGroupDto } from "./dto/add.group.dto";

@Controller('group')
export class GroupController {
    constructor(
        private readonly groupService: GroupService
    ) { }


    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    async getUserGroupList(
        @Req() req: JwtUserRequest,
        @Query('id') groupId: string
    ) {
        const groupList = await this.groupService.getUserGroup(req.user.entity.uid , groupId);

        return BaseResponse.ok(groupList);
    }


    @Post()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    async addGroup(
        @Req() req: JwtUserRequest,
        @Body() addGroupDto : AddGroupDto
    ) {
        await this.groupService.addGroup(req.user.entity.uid , addGroupDto.groupName , addGroupDto.parentGroupUid , addGroupDto.description);

        return BaseResponse.ok();
    }
}