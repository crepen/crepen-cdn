import { Module } from "@nestjs/common";
import { CrepenUserRouteModule } from "./user/user.module";
import { CrepenAuthRouteModule } from "./auth/auth.module";
import { CrepenGroupRouteModule } from "./group/group.module";
import { CrepenFileRouteModule } from "./file/file.module";
import { CrepenSystemModule } from "./system/system.module";

@Module({
    imports: [
        CrepenAuthRouteModule,
        CrepenUserRouteModule,
        CrepenGroupRouteModule,
        CrepenFileRouteModule,
        CrepenSystemModule
    ]
})
export class CrepenAppModule { }