export class CrepenCumulativeMonitorDto{
    constructor(date : string , traffic : string){
        this.date = new Date(date);
        this.traffic = Number(traffic);
        
    }

    date : Date;
    traffic : number;
}