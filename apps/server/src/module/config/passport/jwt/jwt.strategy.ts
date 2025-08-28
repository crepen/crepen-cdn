import { TokenUnauthorizeError } from "@crepen-nest/lib/error/api/common/token_expire.authorize.error";
import { StringUtil } from "@crepen-nest/lib/util";
import { UserEntity } from "@crepen-nest/module/app/user/entity/user.default.entity";
import { CrepenUserService } from "@crepen-nest/module/app/user/user.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import { CrepenTokenData, CrepenTokenType } from "src/interface/jwt";


@Injectable()
export class CrepenAuthJwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly userService: CrepenUserService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.get<string>('jwt.secret')
        })
    }




    async validate(req: Request, payload: Record<string, any>, done: VerifiedCallback): Promise<CrepenTokenData | void> {
        const token: string | undefined = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        let validateUser: UserEntity | undefined = undefined;

       

        if (token) {
            if (!StringUtil.isEmpty(payload?.uid as string)) {
                validateUser = await this.userService.getUserByUid(payload.uid as string | undefined);
            }

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