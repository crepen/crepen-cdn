export class ObjectUtil {
    static isNullOrUndefined = (obj : any) => {
        if(obj === null || obj === undefined){
            return true;
        }

        return false;
    }
}