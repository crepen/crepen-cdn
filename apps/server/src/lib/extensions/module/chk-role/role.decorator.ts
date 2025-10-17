import { SetMetadata } from "@nestjs/common";
import { CrepenRoleGuard } from "./role.guard";
import { UserRoleEnum } from "@crepen-nest/app/api/user/enum/user-role.enum";

/** @deprecated */
export const AllowRoles = (...roles : UserRoleEnum[]) => SetMetadata(CrepenRoleGuard.INJECT_KEY , roles);