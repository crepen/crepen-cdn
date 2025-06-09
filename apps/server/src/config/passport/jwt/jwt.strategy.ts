import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { CrepenLocaleHttpException } from "@crepen-nest/lib/exception/crepen.http.exception";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { UserEntity } from "src/app/user/entity/user.entity";
import { CrepenUserRouteService } from "src/app/user/user.service";
import { CrepenTokenData, CrepenTokenType } from "src/interface/jwt";


@Injectable()
export class CrepenAuthJwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private userService: CrepenUserRouteService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("secret.jwt"),
            passReqToCallback: true
        })


    }



    async validate(req: Request, payload: Record<string, any>, done: VerifiedCallback): Promise<CrepenTokenData | void> {
        const token: string | undefined = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        let validateUser: UserEntity | undefined = undefined;

        if (token) {
 
            validateUser = await this.userService.getMatchUserByUid(payload?.uid as string | undefined);

            if (validateUser === undefined) {
                return done(new CrepenLocaleHttpException('cloud_auth',"AUTHORIZATION_TOKEN_EXPIRED1", HttpStatus.UNAUTHORIZED), false);
            }
        }

        return {
            token: token,
            payload: {
                type: payload.type as CrepenTokenType,
                uid: payload.uid as string
            },
            entity: validateUser
        }
    }
}