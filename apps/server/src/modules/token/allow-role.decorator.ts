import { UserRoleEnum } from "@crepen-nest/app/api/user/enum/user-role.enum";
import { SetMetadata } from "@nestjs/common";
import { AllowRoleGuard } from "./allow-role.guard";

export const AllowRoles = (...roles : UserRoleEnum[]) =>
     SetMetadata(
        AllowRoleGuard.DECO_KEY, 
        roles
    );