import { UserRoleEnum } from "@crepen-nest/app/api/user/enum/user-role.enum";
import { CrepenTokenContext } from "@crepen-nest/interface/common-jwt";
import { TokenUnauthorizeError } from "@crepen-nest/lib/error/api/common/token_expire.authorize.error";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class AllowRoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) { }


    static DECO_KEY = 'user-allow-role-key';

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.get<UserRoleEnum[]>(
            AllowRoleGuard.DECO_KEY,
            context.getHandler()
        );

        const req: Request & { user: CrepenTokenContext } = context.switchToHttp().getRequest();

        for(const item of requiredRoles){
            const matchRole = (req.user.payload.role ?? []).find(x=>x === item);
            if(!matchRole) {
                throw new TokenUnauthorizeError();
            }
        }

        return true;
    }
}