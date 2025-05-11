import { IsString } from "class-validator";

export class TokenDto {

    constructor(acc : string , ref : string ,exp : number) {
        this.accessToken = acc;
        this.refreshToken = ref;
        this.expireTime = exp;
    }

    @IsString()
    accessToken : string;

    @IsString()
    refreshToken : string;

    expireTime: number;
}