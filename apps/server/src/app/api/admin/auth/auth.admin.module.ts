import { forwardRef, Module } from "@nestjs/common";
import { CrepenAdminAuthController } from "./auth.admin.controller";
import { CrepenAdminAuthService } from "./auth.admin.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { CrepenUserModule } from "../../user/user.module";
import { CrepenAuthModule } from "../../auth/auth.module";

@Module({
    imports : [
        forwardRef(() => CrepenUserModule),
        forwardRef(() => CrepenAuthModule),
        PassportModule.register({
            defaultStrategy : 'admin-jwt'
        })
    ],
    controllers : [CrepenAdminAuthController],
    providers : [
        CrepenAdminAuthService,


        JwtService
    ]
})
export class CrepenAdminAuthModule{}