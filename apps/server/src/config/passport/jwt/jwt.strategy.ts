import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { CrepenCommonHttpLocaleError } from "@crepen-nest/lib/error/http/common.http.error";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { UserEntity } from "@crepen-nest/app/common-user/user/entity/user.default.entity";
import { CrepenUserRouteService } from "@crepen-nest/app/common-user/user/user.service";
import { CrepenTokenData, CrepenTokenType } from "@crepen-nest/interface/jwt";
import { Request } from "express";
import { TokenUnauthorizeError } from "src/module/error/token_expire.authorize.error";


@Injectable()
export class CrepenAuthJwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private userService: CrepenUserRouteService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.get<string>('secret.jwt')
        })
    }




    async validate(req: Request, payload: Record<string, any>, done: VerifiedCallback): Promise<CrepenTokenData | void> {
        const token: string | undefined = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        let validateUser: UserEntity | undefined = undefined;

        if (token) {

            validateUser = await this.userService.getMatchUserByUid(payload?.uid as string | undefined);

            if (validateUser === undefined) {
                return done(new TokenUnauthorizeError(), false);
            }
        }

        return {
            token: token,
            payload: {
                type: payload.type as CrepenTokenType,
                uid: payload.uid as string,
                role: payload.role as string
            },
            entity: validateUser
        }
    }
}