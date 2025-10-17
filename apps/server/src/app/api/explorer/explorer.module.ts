import { forwardRef, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CrepenLoggerModule } from "../common/logger/logger.module";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { CrepenUserModule } from "../user/user.module";
import { CrepenExplorerDefaultController } from "./explorer.controller";
import { CrepenExplorerFileController } from "./file.explorer.controller";
import { CrepenExplorerFolderController } from "./folder.explorer.controller";
import { CrepenExplorerFolderService } from "./folder.explorer.service";
import { CrepenExplorerEncryptFileRepository } from "./repository/encrypt-file.explorer.repository";
import { CrepenExplorerRepository } from "./repository/explorer.repository";
import { CrepenExplorerFileEncryptQueueRepository } from "./repository/file-queue.explorer.repository";
import { CrepenExplorerFileRepository } from "./repository/file.explorer.repository";
import { CrepenExplorerEncryptFileService } from "./services/encrypt-file.explorer.service";
import { CrepenExplorerDefaultService } from "./services/explorer.service";
import { CrepenExplorerFileEncryptQueueService } from "./services/file-queue.service";
import { CrepenExplorerFileService } from "./services/file.explorer.service";
import { CrepenExplorerSocketGateway } from "./explorer.socket";
import { PassportConfigModule } from "@crepen-nest/app/config/passport/passport.module";
import { CrepenAuthJwtStrategy } from "@crepen-nest/app/config/passport/jwt/jwt.strategy";


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
        CrepenExplorerFileRepository,

        // CrepenExplorerSocketGateway,

        CrepenExplorerFileEncryptQueueService,
        CrepenExplorerFileEncryptQueueRepository,


        CrepenExplorerEncryptFileService,
        CrepenExplorerEncryptFileRepository,
        

        // Import Modules
        CrepenLoggerService,
        JwtService,
        CrepenAuthJwtStrategy,
    ],
    exports : [
        CrepenExplorerFileService,
        CrepenExplorerFileEncryptQueueService,
        CrepenExplorerEncryptFileService
    ]
})
export class CrepenExplorerModule {}