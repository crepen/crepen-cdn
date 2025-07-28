import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { CrepenCommonHttpLocaleError } from '@crepen-nest/lib/error/http/common.http.error';
import { StringUtil } from '@crepen-nest/lib/util/string.util';
import { Request, Response } from 'express';
import { I18nContext, I18nService, I18nTranslation, I18nValidationException } from 'nestjs-i18n';
import { BaseResponse } from 'src/module/common/base.response';
import * as humps from 'humps'
import { TypeORMError } from 'typeorm';

@Catch(Error)
export class ExceptionResponseFilter implements ExceptionFilter {



    catch(exception: any, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const i18n = I18nContext.current(host);

        let message = "common.INTERNAL_SERVER_ERROR";

        

        if (exception instanceof CrepenCommonHttpLocaleError) {
            message = exception.message;

            Logger.error(i18n.t(message, {
                args: exception.transLocaleArgs
            }))
            if (exception.cause !== undefined) {
                Logger.error(exception.cause);
            }


            response
                .status(exception.getStatus())
                .json(
                    humps.decamelizeKeys(
                        BaseResponse.error(
                            exception.getStatus(),
                            i18n.t(message, {
                                args: exception.transLocaleArgs
                            }),
                            exception.transLocaleCode)
                    )

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
                    humps.decamelizeKeys(
                        BaseResponse.error(exception.getStatus(), i18n.t(message), message)
                    )
                )
        }
        else if (exception instanceof NotFoundException) {
            response.status(404).send()
        }
        else if (exception instanceof BadRequestException) {

            message = 'common.BAD_REQUEST_PARAM';

            const contextLang = request.headers['accept-language'] === 'ko' ? 'ko' : 'en';

            const messageArgs = [
                { lang: 'ko', message: '잘못된 형식의 데이터가 전달되었습니다.' },
                { lang: 'en', message: 'Data in an incorrect format was passed.' }
            ]

            response
                .status(exception.getStatus())
                .json(
                    humps.decamelizeKeys(
                        BaseResponse.error(exception.getStatus(), messageArgs.find(x => x.lang === contextLang).message, message)
                    )
                )
        }
        else if (exception instanceof HttpException) {
            console.log('INTERNAL HTTP ERROR', exception)

            response
                .status(500)
                .json(
                    humps.decamelizeKeys(
                        BaseResponse.error(
                            500,
                            i18n.t(message),
                            message.split('.')[1])
                    )
                )
        }
        else {
            
            Logger.error((exception as Error).stack , 'INTERNAL ERROR');

            console.log((exception as TypeORMError).name)

            response
                .status(500)
                .json(
                    humps.decamelizeKeys(
                        BaseResponse.error(
                            500,
                            i18n.t(message),
                            message.split('.')[1])
                    )
                )
        }






    }


}