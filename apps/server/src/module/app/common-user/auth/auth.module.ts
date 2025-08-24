import { forwardRef, Module } from "@nestjs/common";
import { CrepenAuthRouteService } from "./auth.service";
import { CrepenAuthRouteController } from "./auth.controller";
import { ConfigModule } from "@nestjs/config";
import { CrepenUserRouteModule } from "../user/user.module";
import { CrepenAuthJwtStrategy } from "@crepen-nest/module/config/passport/jwt/jwt.strategy";
import { PassportConfigModule } from "@crepen-nest/module/config/passport/passport.module";
import { CrepenUserModule } from "../../user/user.module";

@Module({
    imports : [
        forwardRef(() => CrepenUserModule),
        ConfigModule, 
        CrepenUserRouteModule,
        PassportConfigModule
    ],
    controllers : [CrepenAuthRouteController],
    providers : [CrepenAuthRouteService , CrepenAuthJwtStrategy ],
    exports : [CrepenAuthRouteService]
})
export class CrepenAuthRouteModule {}