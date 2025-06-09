import { Module } from "@nestjs/common";
import { CrepenUserRouteService } from "./user.service";
import { CrepenUserRepository } from "./user.repository";
import { CrepenUserRouteController } from "./user.controller";

@Module({
    controllers : [CrepenUserRouteController],
    providers : [CrepenUserRouteService , CrepenUserRepository],
    exports : [CrepenUserRouteService]
})
export class CrepenUserRouteModule {}