import { Module } from "@nestjs/common";
import { CrepenSystemInstallController } from "./install.system.controller";

@Module({
    controllers : [CrepenSystemInstallController]
})
export class CrepenSystemInstallModule {}