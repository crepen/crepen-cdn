import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { UtilModule } from 'src/util/util.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/config/passport/jwt-strategy';

@Module({
    imports: [
        UserModule,
        UtilModule,
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
    controllers: [AuthController],
    providers: [AuthService , JwtStrategy],
    exports : [JwtModule]
})
export class AuthModule { }