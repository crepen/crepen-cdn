import { Module } from "@nestjs/common";
import { CrepenAdminSettingController } from "./setting.admin.controller";
import { CrepenAdminSettingService } from "./setting.admin.service";

@Module({
    controllers : [CrepenAdminSettingController],
    providers : [
        CrepenAdminSettingService
    ]
})
export class CrepenAdminSettingModule {}