import { Module } from "@nestjs/common";
import { CrepenFileRouteModule } from "./file/file.module";
import { CrepenGroupRouteModule } from "./group/group.module";
import { CrepenUserRouteModule } from "./user/user.module";
import { CrepenAuthRouteModule } from "./auth/auth.module";
import { CrepenFolderRouteModule } from "./folder/folder.module";

@Module({
    imports: [
        CrepenAuthRouteModule,
        CrepenUserRouteModule,
        CrepenGroupRouteModule,
        CrepenFileRouteModule,
        CrepenFolderRouteModule,
    ]
})
export class CrepenCommonUserAppModule { }