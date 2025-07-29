import { Module } from "@nestjs/common";
import { PlatformAppModule } from "./app/app.module";
import { PlatformConfigModule } from "./config/config.module";

@Module({
    imports: [
        PlatformConfigModule,
        PlatformAppModule,
    ],
    providers : []
})
export class GlobalModule {}