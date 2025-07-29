import { CrepenUserRouteModule } from "@crepen-nest/module/app/common-user/user/user.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        CrepenUserRouteModule,
        PassportModule.register({ defaultStrategy: 'jwt'}),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret : configService.get('secret.jwt')
                }
            },
        })
    ],
    providers: [],
    exports: [JwtModule]
})
export class PassportConfigModule { }