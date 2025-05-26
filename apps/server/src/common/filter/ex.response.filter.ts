import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext, I18nService, I18nTranslation, I18nValidationException } from 'nestjs-i18n';
import { BaseResponse } from 'src/common/base-response';
import { CrepenLocaleHttpException } from '../exception/crepen.http.exception';
import { StringUtil } from 'src/lib/util/string.util';

@Catch(HttpException)
export class ExceptionResponseFilter implements ExceptionFilter {



    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const i18n = I18nContext.current(host);

        let message = "common.INTERNAL_SERVER_ERROR";

        if (exception instanceof CrepenLocaleHttpException) {
            const res = exception.getResponse();

            message = exception.message;

            response
                .status(exception.getStatus())
                .json(
                    BaseResponse.error(
                        exception.getStatus(),
                        i18n.t(message, {
                            args: exception.transLocaleArgs
                        }),
                        exception.transLocaleCode)
                )
        }
        else if (exception instanceof I18nValidationException) {

            if (exception.errors.length > 0) {
                const errorObj = exception.errors[0].constraints;
                const messageObj = Object.values(errorObj)[0];
                if (!StringUtil.isEmpty(messageObj)) {
                    message = i18n.t(messageObj);
                }
            }

            response
                .status(exception.getStatus())
                .json(
                    BaseResponse.error(exception.getStatus(), message)
                )
        }
        else if (exception instanceof HttpException) {

            response
                .status(500)
                .json(
                    BaseResponse.error(500, message)
                )
        }






    }


}