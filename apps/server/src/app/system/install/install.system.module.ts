import { Module } from "@nestjs/common";
import { CrepenSystemInstallController } from "./install.system.controller";
import { CrepenSystemInstallService } from "./install.system.service";
import { CrepenDatabaseService } from "@crepen-nest/config/database/database.config.service";
import { CrepenDatabaseModule } from "@crepen-nest/config/database/database.config.module";
import { CrepenSystemInstallRepository } from "./install.system.repository";

@Module({
    // imports : [CrepenDatabaseModule],
    controllers : [CrepenSystemInstallController],
    providers : [CrepenSystemInstallService , CrepenSystemInstallRepository]
})
export class CrepenSystemInstallModule {}