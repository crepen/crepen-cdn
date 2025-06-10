import { Module } from "@nestjs/common";
import { CrepenAdminUserRouteModule } from "./user/admin-user.module";
import { CrepenAdminAuthRouteModule } from "./auth/admin-auth.module";

@Module({
    imports : [
        CrepenAdminUserRouteModule,
        CrepenAdminAuthRouteModule
    ]
})
export class CrepenAdminAppModule {}