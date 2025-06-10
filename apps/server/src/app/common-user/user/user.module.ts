import { Module } from "@nestjs/common";
import { CrepenUserRouteService } from "./user.service";
import { CrepenUserRepository } from "./user.repository";
import { CrepenUserRouteController } from "./user.controller";
import { CrepenAuthRouteModule } from "../auth/auth.module";
import { CrepenAuthRouteService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports : [],
    controllers : [CrepenUserRouteController],
    providers : [CrepenUserRouteService , CrepenUserRepository ,CrepenAuthRouteService , JwtService],
    exports : [CrepenUserRouteService]
})
export class CrepenUserRouteModule {}