import { CrepenUserModule } from "@crepen-nest/module/app/user/user.module";
import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { DynamicConfigService } from "../dynamic-config/dynamic-config.service";

@Module({
    imports: [
        forwardRef(() => CrepenUserModule),
        PassportModule.register({ defaultStrategy: 'jwt'}),
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
    providers: [],
    exports: [JwtModule]
})
export class PassportConfigModule { }