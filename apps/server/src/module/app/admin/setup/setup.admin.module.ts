import { forwardRef, Module } from "@nestjs/common";
import { CrepenAdminSetupController } from "./setup.admin.controller";
import { CrepenAdminSetupService } from "./setup.admin.service";
import { CrepenAdminAuthModule } from "../auth/auth.admin.module";
import { CrepenAdminAuthService } from "../auth/auth.admin.service";
import { CrepenAdminSetupRepository } from "./setup.admin.repository";

@Module({
    imports : [
        forwardRef(() => CrepenAdminAuthModule)
    ],
    controllers : [
        CrepenAdminSetupController
    ],
    providers : [
        CrepenAdminSetupService,
        CrepenAdminAuthService,
        CrepenAdminSetupRepository
    ]
})
export class CrepenAdminSetupModule {}