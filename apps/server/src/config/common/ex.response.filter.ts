import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { CrepenLocaleHttpException } from '@crepen-nest/lib/exception/crepen.http.exception';
import { BaseResponse } from '@crepen-nest/lib/util/base.response';
import { StringUtil } from '@crepen-nest/lib/util/string.util';
import { Request, Response } from 'express';
import { I18nContext, I18nService, I18nTranslation, I18nValidationException } from 'nestjs-i18n';

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
                    message = messageObj;
                }
            }

            response
                .status(exception.getStatus())
                .json(
                    BaseResponse.error(exception.getStatus(), i18n.t(message) , message )
                )
        }
        else if (exception instanceof NotFoundException){
            response.status(404)
            .json()
        }
        else if (exception instanceof HttpException) {
            console.log('ELSE HTTPEXCEPTION',exception);
            response
                .status(500)
                .json(
                    BaseResponse.error(500, message)
                )
        }
        else {
            console.log('ELSE',exception);
            response
                .status(500)
                .json(
                    BaseResponse.error(500, message)
                )
        }






    }


}