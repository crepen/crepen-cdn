import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
        status = exception.getStatus();
        const res = exception.getResponse();
        message =
            typeof res === 'string' ? res : (res as any).message || message;
        }

        

        response.status(status as number).json({
            success: false,
            timestamp: new Date().toISOString(),
            path: request.url,
            statusCode: status,
            message,
        });
    }
    

}