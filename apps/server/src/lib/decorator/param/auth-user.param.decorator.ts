import { JwtUserRequest } from "@crepen-nest/interface/jwt";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthUser = createParamDecorator((data : string,ctx: ExecutionContext) => {

    const request : JwtUserRequest = ctx.switchToHttp().getRequest();
    const loginUser = request?.user?.entity;

    return loginUser ?? undefined;
})