import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from 'src/config/passport/jwt/jwt.strategy';
import { CrepenPassportModule } from 'src/config/passport/passport.module';

@Module({
    imports: [
        UserModule,
        CrepenPassportModule
    ],
    controllers: [AuthController],
    providers: [AuthService , JwtStrategy],
    exports : []
})
export class AuthModule { }