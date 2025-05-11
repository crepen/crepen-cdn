import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "src/modules/auth/auth.service";
import { UserService } from "src/modules/user/user.service";
import { UserEntity } from "src/modules/user/entity/user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private configService: ConfigService
    ) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get<string>("jwt.secret"),
            passReqToCallback: true
        })


    }

    async validate(req: Request, payload: Record<string , any>, done: VerifiedCallback): Promise<any> {
        const token: string | undefined = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        let validateUser: UserEntity | undefined = undefined;

        if (!!token) {
            validateUser = await this.userService.getMatchUserByUid(payload.uid);

            if(validateUser === undefined){
                return done(new HttpException("Not found user.",HttpStatus.UNAUTHORIZED) , false);
            }
        }


        return {
            token : token,
            payload: {
                type : payload.type,
                uid : payload.uid
            },
            entity: validateUser
        }
    }
}