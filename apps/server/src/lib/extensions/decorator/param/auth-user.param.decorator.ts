import { UserEntity } from "@crepen-nest/app/api/user/entity/user.default.entity";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CustomParamFactory } from "@nestjs/common/interfaces";
import { JwtUserRequest } from "src/interface/jwt";

export const AuthUser
    = createParamDecorator(
        (data: string, ctx: ExecutionContext) => {

            const request: JwtUserRequest = ctx.switchToHttp().getRequest();
            const loginUser: UserEntity | undefined = request?.user?.entity as UserEntity | undefined;

            return loginUser ?? undefined;
        }
    )

