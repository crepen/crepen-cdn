import { forwardRef, Module } from "@nestjs/common";
import { CrepenUserController } from "./user.controller";
import { CrepenUserRepository } from "./user.repository";
import { CrepenUserService } from "./user.service";
import { CrepenLoggerModule } from "../common/logger/logger.module";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { CrepenUserValidateService } from "./validate.user.service";
import { CrepenAuthModule } from "../auth/auth.module";

@Module({
    imports: [
        forwardRef(() => CrepenLoggerModule),
        forwardRef(() => CrepenAuthModule)
    ],
    controllers: [CrepenUserController],
    providers: [
        CrepenUserRepository,
        CrepenUserService,
        CrepenUserValidateService,

        CrepenLoggerService
    ],
    exports : [
        CrepenUserService
    ]
})
export class CrepenUserModule { }