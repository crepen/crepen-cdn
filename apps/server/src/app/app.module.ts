import { Module } from "@nestjs/common";

// import { CrepenSystemModule } from "./system/system.module";
import { CrepenCommonModule } from "./common/common.module";
import { CrepenSystemModule } from "./system/system.module";
import { CrepenCommonUserAppModule } from "./common-user/common-user.module";
import { CrepenAdminAppModule } from "./admin/admin.module";
// import { CrepenSystemModule } from "./system-backup/system.module";

@Module({
    imports: [
        CrepenAdminAppModule,
        CrepenCommonUserAppModule,
        // CrepenSystemModule,
        CrepenCommonModule,
        CrepenSystemModule
    ]
})
export class CrepenAppModule { }