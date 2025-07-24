import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { CrepenCommonHttpLocaleError } from '@crepen-nest/lib/error/http/common.http.error';
import { StringUtil } from '@crepen-nest/lib/util/string.util';
import { Request, Response } from 'express';
import { I18nContext, I18nService, I18nTranslation, I18nValidationException } from 'nestjs-i18n';
import { BaseResponse } from 'src/module/common/base.response';

@Catch(Error)
export class ExceptionResponseFilter implements ExceptionFilter {



    catch(exception: any, host: ArgumentsHost) {


        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const i18n = I18nContext.current(host);

        let message = "common.INTERNAL_SERVER_ERROR";

        if (exception instanceof CrepenCommonHttpLocaleError) {
            const res = exception.getResponse();

            message = exception.message;

            Logger.error(i18n.t(message, {
                args: exception.transLocaleArgs
            }))
            if(exception.cause !== undefined){
                Logger.error(exception.cause);
            }
            

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
                    BaseResponse.error(exception.getStatus(), i18n.t(message), message)
                )
        }
        else if (exception instanceof NotFoundException) {
            response.status(404).send()
        }
        else if (exception instanceof HttpException) {
            response
                .status(500)
                .json(
                    BaseResponse.error(
                        500,
                        i18n.t(message),
                        message.split('.')[1])
                )
        }
        else {
            console.log('?' , exception)

            response
                .status(500)
                .json(
                    BaseResponse.error(
                        500,
                        i18n.t(message),
                        message.split('.')[1])
                )
        }






    }


}