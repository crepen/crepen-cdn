import { CrepenTokenContext, CrepenTokenType } from "@crepen-nest/interface/common-jwt";
import { TokenUnauthorizeError } from "@crepen-nest/lib/error/api/common/token_expire.authorize.error";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class AllowTokenTypeGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) { }

    static DECO_KEY = 'allow-token-type-key';

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const requiredTokenType = this.reflector.get<CrepenTokenType[]>(
            AllowTokenTypeGuard.DECO_KEY,
            context.getHandler()
        );

        const req: Request & { user: CrepenTokenContext } = context.switchToHttp().getRequest();

        const matchType = requiredTokenType.find(x=>x === req.user.payload.type);

        if(!matchType) {
            throw new TokenUnauthorizeError();
        }

        return true;
    }
}