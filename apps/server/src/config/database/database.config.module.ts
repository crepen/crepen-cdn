import { Global, Module } from "@nestjs/common";
import { DatabaseService } from "./database.config.service";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
    imports : [ConfigModule],
    providers : [DatabaseService],
    exports : [DatabaseService]
})
export class DatabaseModule {

}