import { forwardRef, Module } from "@nestjs/common";
import { CrepenUserController } from "./user.controller";
import { CrepenUserRepository } from "./user.repository";
import { CrepenUserService } from "./user.service";
import { CrepenLoggerModule } from "../common/logger/logger.module";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { CrepenUserRouteModule } from "../common-user/user/user.module";

@Module({
    imports: [
        forwardRef(() => CrepenLoggerModule)
    ],
    controllers: [CrepenUserController],
    providers: [
        CrepenUserRepository,
        CrepenUserService,


        CrepenLoggerService
    ],
    exports : [
        CrepenUserService
    ]
})
export class CrepenUserModule { }