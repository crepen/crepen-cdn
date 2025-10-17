import { UserRoleEnum } from "@crepen-nest/app/api/user/enum/user-role.enum";
import { CrepenTokenContext, CrepenTokenOriginPayload } from "@crepen-nest/interface/common-jwt";
import { StringUtil } from "@crepen-nest/lib/util";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

@Injectable()
export class CommonJwtStrategy extends PassportStrategy(Strategy, 'common-jwt') {

    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.get<string>('jwt.secret')
        })
    }


    validate(req: Request, payload: CrepenTokenOriginPayload, done: VerifiedCallback): unknown {
        const token: string | undefined = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        const roleList: UserRoleEnum[] = [];

        const roleKeys = Object.keys(UserRoleEnum) as Array<keyof typeof UserRoleEnum>;

        const roleStrSplit = StringUtil.isEmpty(payload.role) ? [] : payload.role.split('|');

        for (const roleItem of roleStrSplit) {
            for (const key of roleKeys) {
                if (UserRoleEnum[key].toString() === roleItem) {
                    roleList.push(UserRoleEnum[key]);
                }
            }
        }



        const convTokenData: CrepenTokenContext = {
            token: token,
            payload: {
                mode: payload.mode,
                role: roleList,
                type : payload.type
            }
        }

        return convTokenData
    }


}