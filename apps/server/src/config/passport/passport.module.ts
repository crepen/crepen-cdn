import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CrepenUserRouteModule } from "@crepen-nest/app/common-user/user/user.module";
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
export class CrepenPassportConfigModule { }