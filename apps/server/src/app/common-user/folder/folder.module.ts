import { forwardRef, Module } from "@nestjs/common";
import { CrepenFolderRouteController } from "./folder.controller";
import { CrepenFolderRouteService } from "./folder.service";
import { CrepenFolderRouteRepository } from "./folder.repository";
import { CrepenFileRouteService } from "../file/file.service";
import { CrepenFileRouteModule } from "../file/file.module";
import { CrepenFileRouteRepository } from "../file/file.repository";

@Module({
    imports : [
        forwardRef(() => CrepenFileRouteModule),
        
    ],
    controllers : [CrepenFolderRouteController],
    providers : [CrepenFolderRouteService , CrepenFolderRouteRepository  , CrepenFileRouteRepository],
    exports : [CrepenFolderRouteService]
})
export class CrepenFolderRouteModule {}