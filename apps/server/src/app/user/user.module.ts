import { Module } from "@nestjs/common";
import { CrepenUserRouteService } from "./user.service";
import { CrepenUserRepository } from "./user.repository";

@Module({
    providers : [CrepenUserRouteService , CrepenUserRepository],
    exports : [CrepenUserRouteService]
})
export class CrepenUserRouteModule {}