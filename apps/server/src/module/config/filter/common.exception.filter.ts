import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { I18nContext } from "nestjs-i18n";
import { DatabaseConnectError } from "src/module/error/conn.db.error";
import * as humps from 'humps'
import { Response } from "express";
import { BaseResponse } from "src/module/common/base.response";
import { CommonError } from "src/module/error/common.error";

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

        if (error instanceof CommonError) {
            this.getCommonErrorResponse();
        }
        if (error instanceof DatabaseConnectError) {
            this.getDatabaseErrorResponse();
        }
        else {
            this.getDefaultErrorResponse();
        }

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