import { CrepenUserRouteService } from "./user.service";
import { CrepenUserRepository } from "./user.repository";
import { CrepenUserRouteController } from "./user.controller";
import { CrepenAuthRouteService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
    imports : [],
    controllers : [CrepenUserRouteController],
    providers : [CrepenUserRouteService , CrepenUserRepository ,CrepenAuthRouteService , JwtService],
    exports : [CrepenUserRouteService]
})
export class CrepenUserRouteModule {}