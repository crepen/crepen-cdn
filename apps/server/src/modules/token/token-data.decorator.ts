import { CrepenTokenContext } from "@crepen-nest/interface/common-jwt";
import { JwtUserRequest } from "@crepen-nest/interface/jwt";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const TokenContext = createParamDecorator(
    (data: string, ctx: ExecutionContext) : CrepenTokenContext | undefined => {
        const request: JwtUserRequest = ctx.switchToHttp().getRequest();
        const tokenData: CrepenTokenContext = request.user as CrepenTokenContext;

        return tokenData;
    }
)