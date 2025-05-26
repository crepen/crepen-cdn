import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { SystemSetupController } from "./setup.controller";
import { SystemSetupService } from "./setup.service";
import { SystemSetupRepository } from "./setup.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity])
    ],
    controllers: [SystemSetupController],
    providers: [SystemSetupService , SystemSetupRepository]

})
export class SystemSetupModule { };