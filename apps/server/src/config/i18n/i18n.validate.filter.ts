import { ArgumentsHost } from "@nestjs/common";
import { I18nValidationException, I18nValidationExceptionFilter } from "nestjs-i18n";
import { BaseResponse } from "src/module/common/base.response";

export class PlayformI18nValidationExceptionFilter extends I18nValidationExceptionFilter {
    constructor() {
        super({
            detailedErrors: true,
            responseBodyFormatter: (host: ArgumentsHost, exc: I18nValidationException, formattedErrors: object) => {
                console.log(exc);
                return BaseResponse.error(exc.getStatus(), Object.values(exc.errors[0].constraints)[0]);
            }
        })
    }
}