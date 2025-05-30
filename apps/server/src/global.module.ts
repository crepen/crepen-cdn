import { Module } from "@nestjs/common";
import { CrepenConfigModule } from "./config/config.module";
import { CrepenAppModule } from "./app/app.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports : [
        CrepenConfigModule,
        CrepenAppModule,
    ]
})
export class GlobalModule {}