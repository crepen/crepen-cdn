export class CrepenActionError extends Error{
    constructor(message? : string , opt? : ErrorOptions){
        super(message , opt)
    }
}