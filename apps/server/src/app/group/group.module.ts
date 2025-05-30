import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupEntity } from "./entity/group.entity";
import { GroupController } from "./group.controller";
import { GroupRepository } from "./group.repository";
import { GroupService } from "./group.service";
import { CrepenUserRouteModule } from "../user/user.module";

@Module({
    imports: [
        CrepenUserRouteModule,
        TypeOrmModule.forFeature([GroupEntity]),
    ],
    controllers: [GroupController],
    providers: [GroupService, GroupRepository],
    exports: []
})
export class CrepenGroupRouteModule { }