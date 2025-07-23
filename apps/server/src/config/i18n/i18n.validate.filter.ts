import { ArgumentsHost } from "@nestjs/common";
import { I18nValidationException, I18nValidationExceptionFilter } from "nestjs-i18n";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";

export class CrepenI18nValidationExceptionFilter extends I18nValidationExceptionFilter {
    constructor() {
        super({
            detailedErrors: true,
            responseBodyFormatter: (host: ArgumentsHost, exc: I18nValidationException, formattedErrors: object) => {
                // Object.values(exc.errors[0].constraints)[0]
                console.log(exc);
                return BaseResponse.error(exc.getStatus(), Object.values(exc.errors[0].constraints)[0]);
            }
        })
    }
}