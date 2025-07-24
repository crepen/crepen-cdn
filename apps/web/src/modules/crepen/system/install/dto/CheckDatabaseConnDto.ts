export class CheckDatabaseConnResultDto {
    state? : boolean;
}

export class CheckDatabaseConnRequestDto{
    host? : string;
    port? : number;
    username? : string;
    password? : string;
    database? : string;
}