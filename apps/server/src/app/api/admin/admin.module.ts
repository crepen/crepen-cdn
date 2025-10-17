import { Module } from "@nestjs/common";
import { CrepenAdminSettingModule } from "./setting/setting.admin.module";
import { CrepenAdminAuthModule } from "./auth/auth.admin.module";
import { CrepenAdminAuthController } from "./auth/auth.admin.controller";
import { CrepenAdminAuthService } from "./auth/auth.admin.service";

@Module({
    imports : [
        CrepenAdminAuthModule,
        CrepenAdminSettingModule
    ]
})
export class CrepenAdminModule {}
