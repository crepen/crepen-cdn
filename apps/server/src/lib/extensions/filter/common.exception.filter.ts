import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { I18nContext, I18nValidationException } from "nestjs-i18n";
import * as humps from 'humps'
import { Response } from "express";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { DatabaseConnectError } from "@crepen-nest/lib/error/api/common/conn.db.error";
import { CommonError } from "@crepen-nest/lib/error/common.error";

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

        
        if(error instanceof I18nValidationException){
            this.getI18nErrorResponse();
        }
        else if (error instanceof DatabaseConnectError) {
            this.getDatabaseErrorResponse();
        }
        else if (error instanceof CommonError) {
            this.getCommonErrorResponse();
        }
        else {
            this.getDefaultErrorResponse();
        }

    }

    private getI18nErrorResponse = () => {
        const error = this.exception as I18nValidationException;
        const message = this.getTranslateMessage('common.INTERNAL_SERVER_ERROR');
        const errorCode = error.message?.split('.').length > 2 ? error.message?.split('.')[1] : error.message

        this.response
            .status(503)
            .json(
                this.getErrorResponse(
                    error.getStatus(),
                    this.i18n.translate(error.message),
                    errorCode
                )
            )
    }

    private getCommonErrorResponse = () => {
        const error = this.exception as CommonError;
        const message = this.getTranslateMessage('common.INTERNAL_SERVER_ERROR');

        this.response
            .status(503)
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