import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from './dto/jwt.dto';
import { JwtUserPayload } from 'src/common/interface/jwt';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from './interface/token';
import { I18nService } from 'nestjs-i18n';
import { CrepenLocaleHttpException } from 'src/common/exception/crepen.http.exception';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }






    tokenRefresh = async (payload: JwtUserPayload): Promise<TokenDto> => {

        if (payload.type !== TokenType.REFRESH_TOKEN) {
            throw new HttpException("Token is not refresh token.", HttpStatus.BAD_REQUEST);
        }

        const accPayload: JwtUserPayload = { ...payload, type: TokenType.ACCESS_TOKEN };

        const acc = this.jwtService.sign(accPayload, { expiresIn: '300s' });
        const ref = this.jwtService.sign(payload, { expiresIn: '3600s' });

        const expireTime = this.jwtService.verify<{ exp?: number; }>(ref)?.exp ?? undefined;

        return {
            accessToken: acc,
            refreshToken: ref,
            expireTime: expireTime
        }
    }


    getToken = async (id: string, password: string): Promise<TokenDto> => {
        const validateUser: UserEntity | undefined = await this.userService.validateUser(id, password);

        if (validateUser === undefined) {
            throw new CrepenLocaleHttpException('cloud_auth','LOGIN_FAILED_USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        }

        const accPayload: JwtUserPayload = { type: TokenType.ACCESS_TOKEN, uid: validateUser.uid };
        const refPayload: JwtUserPayload = { type: TokenType.REFRESH_TOKEN, uid: validateUser.uid };

        const accessToken = this.jwtService.sign(accPayload, { expiresIn: '5m' });
        const refreshToken = this.jwtService.sign(refPayload, { expiresIn: '1h' });

        const expireTime = this.jwtService.verify<{ exp?: number; }>(refreshToken)?.exp ?? undefined;

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            expireTime: expireTime
        }
    }

    isTokenExpired = async (token: string | undefined, type: TokenType): Promise<boolean> => {

        try {
            const tokenWithoutBearer = token.replaceAll('Bearer' , '').trim()

            const payload = await this.jwtService.verifyAsync<{ type: string, uid: string }>(tokenWithoutBearer);

            if (payload.type !== type as string) {
                throw new Error('Type not matched.');
            }

            return false;
        }
        catch (err) {
            return true;
        }


    }




}