import { Module } from "@nestjs/common";

// import { CrepenSystemModule } from "./system/system.module";
import { CrepenCommonModule } from "./common/common.module";
import { SystemModule } from "./system/system.module";
import { CommonUserAppModule } from "./common-user/common-user.module";
import { CrepenAdminAppModule } from "./admin/admin.module";
import { CrepenExplorerModule } from "./explorer/explorer.module";
// import { CrepenSystemModule } from "./system-backup/system.module";

@Module({
    imports: [
        CrepenAdminAppModule,
        CommonUserAppModule,
        CrepenCommonModule,
        SystemModule,



        CrepenExplorerModule
    ]
})
export class PlatformAppModule { }