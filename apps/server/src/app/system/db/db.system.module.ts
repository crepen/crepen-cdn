import { Module } from "@nestjs/common";
import { CrepenSystemDatabaseService } from "./db.system.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports : [
    ],
    providers : [CrepenSystemDatabaseService],
    exports : [CrepenSystemDatabaseService]
})
export class CrepenSystemDatabaseModule {}