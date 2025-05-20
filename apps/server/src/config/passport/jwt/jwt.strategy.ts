import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "src/modules/auth/auth.service";
import { UserService } from "src/modules/user/user.service";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { JwtTokenData } from "../../../common/interface/jwt";
import { TokenType } from "src/modules/auth/interface/token";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private configService: ConfigService
    ) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("jwt.secret"),
            passReqToCallback: true
        })


    }



    async validate(req: Request, payload: Record<string, any>, done: VerifiedCallback): Promise<JwtTokenData | void> {
        const token: string | undefined = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        let validateUser: UserEntity | undefined = undefined;

        if (token) {
            // if(payload.type !== TokenType.ACCESS_TOKEN){
            //     return done(new HttpException("UNAUTHORIZED.",HttpStatus.UNAUTHORIZED) , false);
            // }

            validateUser = await this.userService.getMatchUserByUid(payload.uid);

            if (validateUser === undefined) {
                return done(new HttpException("Not found user.", HttpStatus.UNAUTHORIZED), false);
            }
        }

        return {
            token: token,
            payload: {
                type: payload.type as TokenType,
                uid: payload.uid as string
            },
            entity: validateUser
        }
    }
}