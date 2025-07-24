export class SystemHealthResultDto {

    install? : boolean;
    database? : {
        default? : boolean,
        local? : boolean
    };

}