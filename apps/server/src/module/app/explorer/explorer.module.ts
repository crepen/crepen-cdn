import { forwardRef, Module } from "@nestjs/common";
import { CrepenExplorerDefaultController } from "./explorer.controller";
import { CrepenExplorerFileController } from "./file.explorer.controller";
import { CrepenExplorerFolderController } from "./folder.explorer.controller";
import { CrepenExplorerFileService } from "./file.explorer.service";
import { CrepenExplorerFolderService } from "./folder.explorer.service";
import { CrepenExplorerRepository } from "./explorer.repository";
import { CrepenLoggerModule } from "../common/logger/logger.module";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { CrepenExplorerDefaultService } from "./explorer.service";
import { PassportConfigModule } from "@crepen-nest/module/config/passport/passport.module";
import { JwtService } from "@nestjs/jwt";
import { CrepenAuthJwtStrategy } from "@crepen-nest/module/config/passport/jwt/jwt.strategy";
import { CrepenUserModule } from "../user/user.module";

@Module({
    imports : [
        forwardRef(() => CrepenLoggerModule),
        forwardRef(() => PassportConfigModule),
        forwardRef(() => CrepenUserModule)
        // CrepenCryptoModule,
    ],
    controllers : [
        CrepenExplorerDefaultController,
        CrepenExplorerFileController,
        CrepenExplorerFolderController
    ],
    providers : [
        CrepenExplorerDefaultService,
        CrepenExplorerFileService,
        CrepenExplorerFolderService,
        CrepenExplorerRepository,
        

        // Import Modules
        CrepenLoggerService,
        JwtService,
        CrepenAuthJwtStrategy,
    ]
})
export class CrepenExplorerModule {}