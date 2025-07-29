import { forwardRef, Module } from "@nestjs/common";
import { CrepenFileRouteController } from "./file.controller";
import { CrepenFileRouteService } from "./file.service";
import { CrepenFileRouteRepository } from "./file.repository";
import { CrepenFolderRouteModule } from "../folder/folder.module";
import { CrepenCryptoModule } from "../../common/crypto/crypto.module";
import { CrepenLoggerModule } from "../../common/logger/logger.module";
import { CrepenLoggerService } from "../../common/logger/logger.service";

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