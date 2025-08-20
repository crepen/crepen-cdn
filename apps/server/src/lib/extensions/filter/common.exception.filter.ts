import { ArgumentsHost, Catch, ExceptionFilter, Logger, NotFoundException } from "@nestjs/common";
import { I18nContext, I18nValidationException } from "nestjs-i18n";
import * as humps from 'humps'
import { Response } from "express";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { DatabaseConnectError } from "@crepen-nest/lib/error/api/common/conn.db.error";
import { CommonError } from "@crepen-nest/lib/error/common.error";
import { StringUtil } from "@crepen-nest/lib/util";

@Catch(Error)
export class CommonExceptionFilter implements ExceptionFilter {

    exception: Error;
    i18n: I18nContext;
    response: Response;

    catch = async (error: any, host: ArgumentsHost) => {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        this.i18n = I18nContext.current(host);
        this.exception = error as Error;
        this.response = response;

        ExceptionResultFactory
            .current(response, this.i18n, this.exception)
            .getResponse();


    }



}

export class ExceptionResultFactory {
    response: Response;
    i18n: I18nContext;
    exception: Error;

    constructor(res: Response, i18n: I18nContext, error: Error) {
        this.response = res;
        this.i18n = i18n;
        this.exception = error;
    }

    static current = (res: Response, i18n: I18nContext, error: Error) => {
        return new ExceptionResultFactory(res, i18n, error);
    }



    getResponse = () => {
        if (this.exception instanceof I18nValidationException) {
            this.getI18nErrorResponse();
        }
        else if (this.exception instanceof DatabaseConnectError) {
            this.getDatabaseErrorResponse();
        }
        else if (this.exception instanceof CommonError) {
            this.getCommonErrorResponse();
        }
        else if (this.exception instanceof NotFoundException) {
            this.getNotFoundResponse();
        }
        else {
            this.getDefaultErrorResponse();
        }

    }






    private getNotFoundResponse = () => {
        this.response
            .status(404)
            .send();
    }

    private getI18nErrorResponse = () => {
        const error = this.exception as I18nValidationException;
        let message = this.getTranslateMessage('common.INTERNAL_SERVER_ERROR');

        if (error.errors.length > 0) {
            const errorObj = error.errors[0].constraints;
            const messageObj = Object.values(errorObj)[0];
            if (!StringUtil.isEmpty(messageObj)) {
                message = messageObj;
            }
        }


        const errorCode = message?.split('.').length >= 2
            ? message.replace(message?.split('.')[0] + '.', '')
            : message

        this.response
            .status(503)
            .json(
                this.getErrorResponse(
                    error.getStatus(),
                    this.i18n.translate(message),
                    errorCode
                )
            )
    }

    private getCommonErrorResponse = () => {
        const error = this.exception as CommonError;
        const message = this.getTranslateMessage('common.INTERNAL_SERVER_ERROR');

        this.response
            .status(error.getStatus() ?? 503)
            .json(
                this.getErrorResponse(
                    error.getStatus(),
                    error.getLocaleMessage({ context: this.i18n }),
                    error.getErrorCode()
                )
            )
    }

    private getDatabaseErrorResponse = () => {
        const message = this.getTranslateMessage(this.exception.message);
        const exception = this.exception as DatabaseConnectError;

        this.response
            .status(exception.getStatus())
            .json(
                this.getErrorResponse(
                    exception.getStatus(),
                    message,
                    exception.getErrorCode()
                )
            )

    }


    private getDefaultErrorResponse = () => {
        Logger.error(this.exception.message, 'UnknownException');
        Logger.error(this.exception.stack, 'UnknownException');
        const message = this.getTranslateMessage('common.INTERNAL_SERVER_ERROR');

        this.response
            .status(503)
            .json(
                this.getErrorResponse(
                    503,
                    message,
                    'INTERNAL_SERVER_ERROR'
                )
            )
    }



    private getTranslateMessage = (message?: string): string => {
        try {
            return this.i18n.t<string, string>(message);
        }
        catch (e) {
            return message;
        }
    }

    private getErrorResponse = (statusCode: number, message?: string, errorCode?: string) => {
        return humps.decamelizeKeys(
            BaseResponse.error(
                statusCode,
                message,
                errorCode
            )
        )
    }
}