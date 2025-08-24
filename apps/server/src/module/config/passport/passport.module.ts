import { CrepenUserModule } from "@crepen-nest/module/app/user/user.module";
import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        forwardRef(() => CrepenUserModule),
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