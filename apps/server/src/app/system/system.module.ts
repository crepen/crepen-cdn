import { Module } from "@nestjs/common";
import { CrepenSystemHealthModule } from "./health/health.system.module";
import { CrepenSystemDatabaseModule } from "./db/db.system.module";
import { CrepenSystemInstallModule } from "./install/install.system.module";

@Module({
    imports : [
      CrepenSystemHealthModule,
      CrepenSystemDatabaseModule,
      CrepenSystemInstallModule
    ]
})
export class CrepenSystemModule {}