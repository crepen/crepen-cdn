import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CrepenUserRouteModule } from "src/app/user/user.module";
import { CrepenUserRouteService } from "src/app/user/user.service";
@Module({
    imports: [
        CrepenUserRouteModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {

                return {
                    secret: configService.get<string>("secret.jwt"),
                    signOptions: {
                        expiresIn: configService.get<string>("jwt.expireTime")
                    } 
                }
            },
        })
    ],
    providers: [],
    exports: [JwtModule]
})
export class CrepenPassportConfigModule { }