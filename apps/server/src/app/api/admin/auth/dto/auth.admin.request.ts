import { IsOptional } from "class-validator";

export class ChangeInitAccountPasswordRequest {
    @IsOptional()
    password : string;
}