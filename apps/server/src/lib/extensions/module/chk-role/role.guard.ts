import { UserRoleEnum } from "@crepen-nest/app/api/user/enum/user-role.enum";
import { CrepenTokenData } from "@crepen-nest/interface/jwt";
import { TokenUnauthorizeError } from "@crepen-nest/lib/error/api/common/token_expire.authorize.error";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class CrepenRoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) { }

    static INJECT_KEY = 'allow_role';

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.get<UserRoleEnum[]>(
            CrepenRoleGuard.INJECT_KEY,
            context.getHandler()
        );





        if (!requiredRoles) {
            return true;
        }

        // ROLE CHECK


        const req: Request & { user: CrepenTokenData } = context.switchToHttp().getRequest();

        const userRole = req.user.payload.role;

        if ((userRole ?? []).filter(x => requiredRoles.indexOf(x) > -1).length > 0) {
            return true;
        }
        else {
            throw new TokenUnauthorizeError();
            return false;
        }

        return true;
    }
}