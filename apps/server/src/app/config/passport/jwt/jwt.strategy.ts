import { TokenUnauthorizeError } from "@crepen-nest/lib/error/api/common/token_expire.authorize.error";
import { StringUtil } from "@crepen-nest/lib/util";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import { CrepenTokenData, CrepenTokenType, CrepenUserPayload } from "src/interface/jwt";
import { DynamicConfigService } from "../../dynamic-config/dynamic-config.service";
import { UserEntity } from "@crepen-nest/app/api/user/entity/user.default.entity";
import { UserRoleEnum } from "@crepen-nest/app/api/user/enum/user-role.enum";
import { CrepenUserService } from "@crepen-nest/app/api/user/user.service";


@Injectable()
export class CrepenAuthJwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly userService: CrepenUserService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.get<string>('jwt.secret')
        })
    }




    async validate(req: Request, payload: CrepenUserPayload, done: VerifiedCallback): Promise<CrepenTokenData | void> {
        const token: string | undefined = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        let validateUser: UserEntity | undefined = undefined;


        if (token) {
            if (!StringUtil.isEmpty(payload?.uid)) {
                validateUser = await this.userService.getUserDataIncludeRoles(payload.uid);
            }

            if (validateUser === undefined) {
                return done(new TokenUnauthorizeError(), false);
            }
        }

        return {
            token: token,
            payload: {
                type: payload.type,
                uid: payload.uid,
                role: payload.role as UserRoleEnum[],
                mode: payload.mode as 'init' | 'common'
            },
            entity: validateUser
        }
    }
}