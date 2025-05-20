import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("jwt.secret"),
                signOptions: {
                    expiresIn: configService.get<string>("jwt.expireTime")
                }
            }),
        })
    ],
    exports : [JwtModule]
})
export class CrepenPassportModule { }