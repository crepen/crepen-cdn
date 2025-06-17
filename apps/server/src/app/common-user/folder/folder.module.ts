import { Module } from "@nestjs/common";
import { CrepenFolderRouteController } from "./folder.controller";
import { CrepenFolderRouteService } from "./folder.service";
import { CrepenFolderRouteRepository } from "./folder.repository";
import { CrepenFileRouteService } from "../file/file.service";
import { CrepenFileRouteModule } from "../file/file.module";

@Module({
    imports : [
        CrepenFileRouteModule
    ],
    controllers : [CrepenFolderRouteController],
    providers : [CrepenFolderRouteService , CrepenFolderRouteRepository ]
})
export class CrepenFolderRouteModule {}