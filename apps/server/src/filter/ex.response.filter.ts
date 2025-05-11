import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseResponse } from 'src/common/base-response';
  
@Catch()
export class ExceptionResponseFilter implements ExceptionFilter {

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


        console.log(exception);


        response.status(status as number).json(BaseResponse.error(status , message))
    }


}