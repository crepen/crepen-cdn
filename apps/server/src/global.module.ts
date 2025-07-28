import { Module } from "@nestjs/common";
import { PlatformConfigModule } from "./config/config.module";
import { PlatformAppModule } from "./app/app.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        PlatformConfigModule,
        PlatformAppModule,
    ],
    providers : []
})
export class GlobalModule {}