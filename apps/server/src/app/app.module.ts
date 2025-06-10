import { Module } from "@nestjs/common";

import { CrepenSystemModule } from "./system/system.module";
import { CrepenAdminAppModule } from "./admin/admin.module";
import { CrepenCommonUserAppModule } from "./common-user/common-user.module";

@Module({
    imports: [
        CrepenAdminAppModule,
        CrepenCommonUserAppModule,
        CrepenSystemModule
    ]
})
export class CrepenAppModule { }