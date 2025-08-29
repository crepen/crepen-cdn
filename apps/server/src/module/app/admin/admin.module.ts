import { Module } from "@nestjs/common";
import { CrepenAdminAuthModule } from "./auth/auth.admin.module";
import { CrepenAdminSetupModule } from "./setup/setup.admin.module";

@Module({
    imports : [
        CrepenAdminAuthModule,
        CrepenAdminSetupModule
    ]
})
export class CrepenAdminModule {}
