import { HttpStatus } from "@nestjs/common";

export class BaseResponse<T> {

    success: boolean;
    timestamp: string;
    statusCode: number;

    data?: T
    message?: string | string[];


    static ok<T>(data?: T, statusCode?: HttpStatus): BaseResponse<T> {

        const res = new BaseResponse<T>();

        res.success = true;
        res.data = data;
        res.statusCode = statusCode || 200;
        res.timestamp = new Date().toISOString();


        return res;
    }


   static error<T>(statusCode: HttpStatus, message?: string | string[]) {

        const res = new BaseResponse<T>();

        res.success = false;
        res.message = message;
        res.statusCode = statusCode || 500;
        res.timestamp = new Date().toISOString();

        return res;
    }

}