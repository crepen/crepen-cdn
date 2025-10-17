export class ArrayUtil {
    static isContain = (array : unknown[], item : unknown | undefined) => {
        if(array.find(x=>x === item)){
            return true;
        }
        else{
            return false;
        }
    }

    static firstOrUndefined = <T = unknown>(array? : T[]) => {
        if(Array.isArray(array)){
            if(array.length > 0){
                return array[0]
            }
        }

        return undefined;
    }
}