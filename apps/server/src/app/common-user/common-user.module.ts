import { Module } from "@nestjs/common";
import { CrepenFileRouteModule } from "./file/file.module";
import { CrepenUserRouteModule } from "./user/user.module";
import { CrepenAuthRouteModule } from "./auth/auth.module";
import { CrepenFolderRouteModule } from "./folder/folder.module";

@Module({
    imports: [
        CrepenAuthRouteModule,
        CrepenUserRouteModule,
        CrepenFileRouteModule,
        CrepenFolderRouteModule,
        CrepenFileRouteModule
    ]
})
export class CrepenCommonUserAppModule { }