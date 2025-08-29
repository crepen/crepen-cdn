import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";

export class AdminSetupDatabaseRequest {

    @IsOptional()
    host? : string;

    @IsOptional()
    port? : number;

    @IsOptional()
    @Expose({name : "user_name"})
    userName?: string;

    @IsOptional()
    password?: string;

    @IsOptional()
    
    database?: string;
}