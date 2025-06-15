import { Module } from "@nestjs/common";
import { CrepenFolderRouteController } from "./folder.controller";
import { CrepenFolderRouteService } from "./folder.service";
import { CrepenFolderRouteRepository } from "./folder.repository";

@Module({
    controllers : [CrepenFolderRouteController],
    providers : [CrepenFolderRouteService , CrepenFolderRouteRepository]
})
export class CrepenFolderRouteModule {}