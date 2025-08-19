import { forwardRef, Module } from "@nestjs/common";
import { CrepenExplorerDefaultController } from "./explorer.controller";
import { CrepenExplorerFileController } from "./file.explorer.controller";
import { CrepenExplorerFolderController } from "./folder.explorer.controller";
import { CrepenExplorerFileService } from "./file.explorer.service";
import { CrepenExplorerFolderService } from "./folder.explorer.service";
import { CrepenExplorerRepository } from "./explorer.repository";
import { CrepenLoggerModule } from "../common/logger/logger.module";
import { CrepenCryptoModule } from "../common/crypto/crypto.module";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { CrepenExplorerDefaultService } from "./explorer.service";
import { MulterModule } from "@nestjs/platform-express";

@Module({
    imports : [
        forwardRef(() => CrepenLoggerModule),
        CrepenCryptoModule,
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
        CrepenLoggerService
    ]
})
export class CrepenExplorerModule {}