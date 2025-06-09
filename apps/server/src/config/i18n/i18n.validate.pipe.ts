import { I18nValidationPipe } from "nestjs-i18n";

export class CrepenI18nValidationPipe extends I18nValidationPipe{
    constructor(){
        super({
            whitelist : true,
            transform : true,
            forbidNonWhitelisted : false
        })
    }
}