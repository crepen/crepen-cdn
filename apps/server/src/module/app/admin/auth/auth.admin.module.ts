import { Module } from "@nestjs/common";
import { CrepenAdminAuthController } from "./auth.admin.controller";
import { CrepenAdminAuthService } from "./auth.admin.service";
import { CrepenAdminAuthRepository } from "./auth.admin.repository";

@Module({
    controllers : [
        CrepenAdminAuthController
    ],
    providers : [
        CrepenAdminAuthService,
        CrepenAdminAuthRepository
    ],
    exports : [
        CrepenAdminAuthService,
        CrepenAdminAuthRepository
    ]
})
export class CrepenAdminAuthModule {}