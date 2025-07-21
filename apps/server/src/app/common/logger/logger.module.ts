import { Module } from "@nestjs/common";
import { CrepenLoggerService } from "./logger.service";
import { CrepenFileTrafficLoggerRepository, CrepenLoggerRepository } from "./logger.repository";

@Module({
    imports: [

    ],
    providers: [
        CrepenLoggerService,
        CrepenLoggerRepository,
        CrepenFileTrafficLoggerRepository
    ],
    exports : [
        CrepenLoggerService,
        CrepenFileTrafficLoggerRepository
    ]
})
export class CrepenLoggerModule { }