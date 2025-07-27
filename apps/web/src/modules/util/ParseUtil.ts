import { ObjectUtil } from "@web/lib/util/object.util"

export class ParseUtil {


    static parseString = <T=string>(data : unknown) : T | undefined => {
        if(typeof data === 'string' && !ObjectUtil.isNullOrUndefined(data)){
            return data.toString() as T;
        }
        
        return undefined;
    }

    static parseNumber = (data : unknown) : number | undefined => {
        if(typeof data === 'number' && !ObjectUtil.isNullOrUndefined(data)){
            return isNaN(Number(data)) ? undefined : Number(data);
        }
        
        return undefined;
    }

    static parseBoolean = (data : unknown) : boolean | undefined => {
        if(typeof data === 'boolean' && !ObjectUtil.isNullOrUndefined(data)){
            return data;
        }
        else if(typeof data === 'string' && !ObjectUtil.isNullOrUndefined(data)){
            if(data === 'true' || data === 'false'){
                return data === 'true'
            }
        }

        return undefined;
    }

    static parseArray = <T>(data : unknown) :  Array<T> | undefined => {
        if(!ObjectUtil.isNullOrUndefined(data) && Array.isArray(data)){
            return data as Array<T>;
        }

        return undefined;
    }

    static parseStringArray = (data : unknown) : Array<string> | undefined => {
        const arr = this.parseArray<string>(data);
        if(arr !== undefined && arr.every(x=>typeof x === 'string')){
            return arr as Array<string>
        }

        return undefined;
    }

    static parseNumberArray = (data : unknown) : Array<number> | undefined => {
        const arr = this.parseArray<number>(data);
        if(arr !== undefined && arr.every(x=>typeof x === 'number')){
            return arr as Array<number>
        }

        return undefined;
    }
}