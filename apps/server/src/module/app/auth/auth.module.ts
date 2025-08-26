import { forwardRef, Module } from "@nestjs/common";
import { CrepenAuthController } from "./auth.controller";
import { CrepenAuthRepository } from "./auth.repository";
import { CrepenAuthService } from "./auth.service";
import { CrepenLoggerModule } from "../common/logger/logger.module";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { CrepenUserModule } from "../user/user.module";
import { PassportConfigModule } from "@crepen-nest/module/config/passport/passport.module";

@Module({
    imports: [
        forwardRef(() => CrepenLoggerModule),
        forwardRef(() => CrepenUserModule),
        forwardRef(() => PassportConfigModule)
    ],
    controllers: [CrepenAuthController],
    providers: [
        CrepenAuthRepository,
        CrepenAuthService,


        CrepenLoggerService
    ],
    exports : [
        CrepenAuthService
    ]
})
export class CrepenAuthModule { }