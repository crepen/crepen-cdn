import { Module } from "@nestjs/common";
import { EncryptUtil } from "./encrypt.util";


@Module({
    providers: [
        EncryptUtil
    ],
    exports: [
        EncryptUtil
    ]
})

export class UtilModule {}