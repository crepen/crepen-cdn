import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CrepenSystemEntity } from "./entity/system.entity";
import { CrepenSystemRepository } from "./system.repository";
import { CrepenSystemService } from "./system.service";
import { CrepenUserRouteModule } from "../user/user.module";

@Module({
    imports : [
        TypeOrmModule.forFeature([CrepenSystemEntity]),
        CrepenUserRouteModule
    ],
    providers : [CrepenSystemRepository , CrepenSystemService],
    exports : [CrepenSystemService]
})
export class CrepenSystemModule {}