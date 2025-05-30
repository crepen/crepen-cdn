import { Module } from "@nestjs/common";
import { CrepenAuthRouteService } from "./auth.service";
import { CrepenAuthRouteController } from "./auth.controller";
import { ConfigModule } from "@nestjs/config";
import { CrepenAuthJwtStrategy } from "src/config/passport/jwt/jwt.strategy";
import { CrepenPassportConfigModule } from "src/config/passport/passport.module";
import { CrepenUserRouteModule } from "../user/user.module";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports : [
        ConfigModule,
        CrepenUserRouteModule,
        CrepenPassportConfigModule
    ],
    controllers : [CrepenAuthRouteController],
    providers : [CrepenAuthRouteService , CrepenAuthJwtStrategy ]
})
export class CrepenAuthRouteModule {}