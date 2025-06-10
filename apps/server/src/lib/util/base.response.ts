import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { instanceToPlain } from "class-transformer";


export class BaseResponse<T> {

    success: boolean;
    timestamp: string;
    statusCode: number;

    data?: T
    message?: string | string[];

    errorCode?: string;


    static ok<T = any>(data?: T, statusCode?: HttpStatus, message?: string): BaseResponse<T> {

        const res = new BaseResponse<T>();

        res.success = true;
        res.data = data;
        res.statusCode = statusCode || 200;
        res.timestamp = new Date().toISOString();
        res.message = message;

        return res;
    }



    static error<T>(statusCode: HttpStatus, message?: string | string[], errorCode?: string): Record<string, unknown> {



        const res = new BaseResponse<T>();

        res.success = false;
        res.message = message;
        res.statusCode = statusCode || 500;
        res.timestamp = new Date().toISOString();
        res.errorCode = errorCode ?? undefined;

        return instanceToPlain(res);

        // return {
        //     success : false,
        //     message : message,
        //     statusCode : statusCode || 500,
        //     timestamp : new Date().toISOString(),
        //     errorCode : errorCode
        // };
    }

}