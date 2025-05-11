import { IsString } from "class-validator";

export class TokenDto {

    constructor(acc : string , ref : string) {
        this.accessToken = acc;
        this.refreshToken = ref;
    }

    @IsString()
    accessToken : string;

    @IsString()
    refreshToken : string;
}