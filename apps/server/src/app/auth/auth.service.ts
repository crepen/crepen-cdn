import { HttpStatus, Injectable } from "@nestjs/common";
import { CrepenUserRouteService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { CrepenToken, CrepenTokenGroup, CrepenTokenType, CrepenUserPayload } from "@web/interface/jwt";
import { UserEntity } from "../user/entity/user.entity";
import { CrepenLocaleHttpException } from "@web/lib/exception/crepen.http.exception";
import { EncryptUtil } from "@web/lib/util/encrypt.util";

@Injectable()
export class CrepenAuthRouteService {


    constructor(
        private readonly userService: CrepenUserRouteService,
        private readonly jwtService: JwtService,
    ) { }





    tokenRefresh = async (payload: CrepenUserPayload): Promise<CrepenTokenGroup> => {

        if (payload.type !== 'refresh_token') {
            throw new CrepenLocaleHttpException("cloud_auth", "AUTHORIZATION_TOKEN_EXPIRED", HttpStatus.BAD_REQUEST);
        }

        const accPayload: CrepenUserPayload = { ...payload, type: 'access_token' };



        const acc = this.jwtService.sign(accPayload, { expiresIn: '300s' });
        const ref = this.jwtService.sign(payload, { expiresIn: '3600s' });

        const accessToken: CrepenToken = {
            type: 'access_token',
            value: acc,
            expireTime: this.jwtService.verify<{ exp?: number; }>(acc)?.exp ?? undefined
        }

        const refreshToken: CrepenToken = {
            type: 'refresh_token',
            value: ref,
            expireTime: this.jwtService.verify<{ exp?: number; }>(ref)?.exp ?? undefined
        }

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }


    getToken = async (id: string, password: string): Promise<CrepenTokenGroup> => {


        const matchUser  = await this.userService.getUserDataByIdOrEmail(id);

        if (matchUser === undefined || !await EncryptUtil.comparePassword(password, matchUser?.password)) {
            throw new CrepenLocaleHttpException('cloud_auth', 'LOGIN_FAILED_INPUT_DATA_NOT_CORRECT', HttpStatus.UNAUTHORIZED);
        }


        const accPayload: CrepenUserPayload = { type: 'access_token', uid: matchUser.uid };
        const refPayload: CrepenUserPayload = { type: 'refresh_token', uid: matchUser.uid };


        const acc = this.jwtService.sign(accPayload, { expiresIn: '5m' });
        const ref = this.jwtService.sign(refPayload, { expiresIn: '1h' });

        const accessToken: CrepenToken = {
            type: 'access_token',
            value: acc,
            expireTime: this.jwtService.verify<{ exp?: number; }>(acc)?.exp ?? undefined
        }

        const refreshToken: CrepenToken = {
            type: 'refresh_token',
            value: ref,
            expireTime: this.jwtService.verify<{ exp?: number; }>(ref)?.exp ?? undefined
        }

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    isTokenExpired = async (token: string | undefined, type: CrepenTokenType): Promise<boolean> => {

        try {
            const tokenWithoutBearer = token.replaceAll('Bearer', '').trim()

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