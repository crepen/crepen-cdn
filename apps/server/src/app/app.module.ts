import { Module } from "@nestjs/common";

import { CrepenSystemModule } from "./system/system.module";
import { CrepenAdminAppModule } from "./admin/admin.module";
import { CrepenCommonUserAppModule } from "./common-user/common-user.module";
import { CrepenCommonModule } from "./common/common.module";

@Module({
    imports: [
        CrepenAdminAppModule,
        CrepenCommonUserAppModule,
        CrepenSystemModule,
        CrepenCommonModule
    ]
})
export class CrepenAppModule { }