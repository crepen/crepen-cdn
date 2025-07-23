import { HttpStatus, Injectable } from "@nestjs/common";
import { CrepenUserRouteService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { CrepenToken, CrepenTokenGroup, CrepenTokenType, CrepenUserPayload } from "@crepen-nest/interface/jwt";
import { UserEntity } from "../user/entity/user.default.entity";
import { CrepenCommonHttpLocaleError } from "@crepen-nest/lib/error/http/common.http.error";
import { EncryptUtil } from "@crepen-nest/lib/util/encrypt.util";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CrepenAuthRouteService {


    constructor(
        private readonly userService: CrepenUserRouteService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }


    validatePassword = (password?: string): boolean => {
        const passwordRegex = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9]).{12,16}$/g)

        if (!passwordRegex.test(password ?? '')) {
            return false;
        }
        else {
            return true;
        }
    }


    tokenRefresh = async (payload: CrepenUserPayload): Promise<CrepenTokenGroup> => {

        const expireAct = this.configService.get<string>('jwt.expireAct');
        const expireRft = this.configService.get<string>('jwt.expireRft');

        if (payload.type !== 'refresh_token') {
            throw new CrepenCommonHttpLocaleError("cloud_auth", "AUTHORIZATION_TOKEN_EXPIRED", HttpStatus.BAD_REQUEST);
        }

        const accPayload: CrepenUserPayload = { ...payload, type: 'access_token' };



        const acc = this.jwtService.sign(accPayload, { expiresIn: expireAct});
        const ref = this.jwtService.sign(payload, { expiresIn: expireRft });

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

        const expireAct = this.configService.get<string>('jwt.expireAct');
        const expireRft = this.configService.get<string>('jwt.expireRft');


        const matchUser = await this.userService.getUserDataByIdOrEmail(id);

        if (matchUser === undefined || !await EncryptUtil.comparePassword(password, matchUser?.password)) {
            throw new CrepenCommonHttpLocaleError('cloud_auth', 'LOGIN_FAILED_INPUT_DATA_NOT_CORRECT', HttpStatus.UNAUTHORIZED);
        }


        const accPayload: CrepenUserPayload = { type: 'access_token', uid: matchUser.uid, role: (matchUser.roles ?? []).join(',') };
        const refPayload: CrepenUserPayload = { type: 'refresh_token', uid: matchUser.uid, role: (matchUser.roles ?? []).join(',') };

        const acc = this.jwtService.sign(accPayload, { expiresIn: expireAct });
        const ref = this.jwtService.sign(refPayload, { expiresIn: expireRft });

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