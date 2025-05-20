import { Module } from "@nestjs/common";
import { UserModule } from "src/modules/user/user.module";
import { GroupController } from "./group.controller";
import { GroupService } from "./group.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupEntity } from "./entity/group.entity";
import { GroupRepository } from "./group.repository";

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([GroupEntity]), 
    ],
    controllers: [GroupController], 
    providers: [GroupService, GroupRepository],
    exports: []
})
export class GroupModule { }