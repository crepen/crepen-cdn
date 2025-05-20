import { Global, Module } from "@nestjs/common";
import { I18nModule } from "nestjs-i18n";
import { i18nConfig } from "./i18n.config";

@Global()
@Module({
    imports: [
        I18nModule.forRoot(i18nConfig())
    ],
    providers : [],
    exports: [I18nModule]
})

export class I18nConfigModule { }
