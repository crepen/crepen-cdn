import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { DynamicConfigService } from "../dynamic-config/dynamic-config.service";
import { CrepenUserModule } from "@crepen-nest/app/api/user/user.module";
import { CommonJwtStrategy } from "./guards/common-jwt/common-jwt.strategy";
import { UserJwtStrategy } from "./guards/user-jwt/user-jwt.strategy";

@Module({
    imports: [
        forwardRef(() => CrepenUserModule),
        PassportModule.register({ defaultStrategy: 'common-jwt'}),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (dynamicService: DynamicConfigService) => {
                return {
                    secret : dynamicService.get('jwt.secret')
                }
            },
        })
    ],
    providers: [
        CommonJwtStrategy,
        UserJwtStrategy
    ],
    exports: [JwtModule]
})
export class PassportConfigModule { }