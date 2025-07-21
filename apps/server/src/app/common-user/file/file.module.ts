import { forwardRef, Module } from "@nestjs/common";
import { CrepenFileRouteController } from "./file.controller";
import { CrepenFileRouteService } from "./file.service";
import { CrepenFileRouteRepository } from "./file.repository";
import { CrepenFolderRouteModule } from "../folder/folder.module";
import { CrepenFolderRouteService } from "../folder/folder.service";
import { CrepenCryptoModule } from "@crepen-nest/app/common/crypto/crypto.module";
import { CrepenLoggerModule } from "@crepen-nest/app/common/logger/logger.module";
import { CrepenLoggerService } from "@crepen-nest/app/common/logger/logger.service";

@Module({
    imports : [
        forwardRef(() => CrepenFolderRouteModule),
        forwardRef(() => CrepenLoggerModule),
        CrepenCryptoModule
    ],
    controllers : [CrepenFileRouteController],
    providers : [CrepenFileRouteService , CrepenFileRouteRepository , CrepenLoggerService],
    exports : [CrepenFileRouteService]
})
export class CrepenFileRouteModule {}