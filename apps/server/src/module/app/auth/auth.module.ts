import { forwardRef, Module } from "@nestjs/common";
import { CrepenAuthController } from "./auth.controller";
import { CrepenAuthRepository } from "./auth.repository";
import { CrepenAuthService } from "./auth.service";
import { CrepenLoggerModule } from "../common/logger/logger.module";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { CrepenUserRouteModule } from "../common-user/user/user.module";
import { CrepenUserModule } from "../user/user.module";

@Module({
    imports: [
        forwardRef(() => CrepenLoggerModule),
        forwardRef(() => CrepenUserModule)
    ],
    controllers: [CrepenAuthController],
    providers: [
        CrepenAuthRepository,
        CrepenAuthService,


        CrepenLoggerService
    ]
})
export class CrepenAuthModule { }