import { Module } from "@nestjs/common";
import { CrepenFileRouteController } from "./file.controller";
import { CrepenFileRouteService } from "./file.service";
import { CrepenFileRouteRepository } from "./file.repository";

@Module({
    controllers : [CrepenFileRouteController],
    providers : [CrepenFileRouteService , CrepenFileRouteRepository],
    exports : [CrepenFileRouteService]
})
export class CrepenFileRouteModule {}