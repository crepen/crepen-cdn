import { Module } from "@nestjs/common";

// import { CrepenSystemModule } from "./system/system.module";
import { CrepenCommonModule } from "./common/common.module";
import { SystemModule } from "./system/system.module";
import { CommonUserAppModule } from "./common-user/common-user.module";
import { CrepenExplorerModule } from "./explorer/explorer.module";
import { CrepenAuthModule } from "./auth/auth.module";
import { CrepenUserModule } from "./user/user.module";
// import { CrepenSystemModule } from "./system-backup/system.module";

@Module({
    imports: [
        CommonUserAppModule,
        CrepenCommonModule,
        SystemModule,



        CrepenExplorerModule,
        CrepenAuthModule,
        CrepenUserModule
    ]
})
export class PlatformAppModule { }