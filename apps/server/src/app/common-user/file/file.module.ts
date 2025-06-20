import { forwardRef, Module } from "@nestjs/common";
import { CrepenFileRouteController } from "./file.controller";
import { CrepenFileRouteService } from "./file.service";
import { CrepenFileRouteRepository } from "./file.repository";
import { CrepenFolderRouteModule } from "../folder/folder.module";
import { CrepenFolderRouteService } from "../folder/folder.service";
import { CrepenCryptoModule } from "@crepen-nest/app/common/crypto/crypto.module";

@Module({
    imports : [
        forwardRef(() => CrepenFolderRouteModule),
        CrepenCryptoModule
    ],
    controllers : [CrepenFileRouteController],
    providers : [CrepenFileRouteService , CrepenFileRouteRepository],
    exports : [CrepenFileRouteService]
})
export class CrepenFileRouteModule {}