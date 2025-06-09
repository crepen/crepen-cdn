import { Controller, Get, HttpCode, HttpStatus, UseGuards, Req, Query, Post, Body } from "@nestjs/common";
import { JwtUserRequest } from "@crepen-nest/interface/jwt";
import { BaseResponse } from "@crepen-nest/lib/util/base.response";
import { GroupService } from "./group.service";
import { CrepenAuthJwtGuard } from "@crepen-nest/config/passport/jwt/jwt.guard";
import { AddGroupRequestDto } from "./dto/group.add.dto";

@Controller('group')
export class GroupController {
    constructor(
        private readonly groupService: GroupService
    ) { }


    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    async getUserGroupList(
        @Req() req: JwtUserRequest,
        @Query('id') groupId: string
    ) {
        const groupList = await this.groupService.getUserGroup(req.user.entity.uid , groupId);

        return BaseResponse.ok(groupList);
    }


    @Post()
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    async addGroup(
        @Req() req: JwtUserRequest,
        @Body() addGroupDto : AddGroupRequestDto
    ) {
        await this.groupService.addGroup(req.user.entity.uid , addGroupDto.groupName , addGroupDto.parentGroupUid , addGroupDto.description);

        return BaseResponse.ok();
    }
}