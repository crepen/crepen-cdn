export class ObjectUtil {

    static classToPlaneObject = <T=Record<string,unknown>>(classObj : object) : T => {
        return JSON.parse(JSON.stringify(classObj));
    }

     static isNullOrUndefined = (obj : unknown) => {
        if(obj === null || obj === undefined){
            return true;
        }

        return false;
    }


    static isObject = (item: any): item is Record<string, any> => {
        return item && typeof item === 'object' && !Array.isArray(item);
    }


    static deepMerge(base: object, override: object): Record<string, unknown> {
        const result: Record<string, unknown> = { ...base };
        const baseRecord = base as Record<string, unknown>;
        const overrideRecord = override as Record<string, unknown>;

        for (const key in override) {
            if (Object.prototype.hasOwnProperty.call(override, key)) {
                const baseValue = baseRecord[key];
                const overrideValue = overrideRecord[key];

                if (this.isObject(baseValue) && this.isObject(overrideValue)) {
                    result[key] = this.deepMerge(baseValue, overrideValue); // 재귀
                } else if (overrideValue !== undefined) {
                    result[key] = overrideValue;
                }
            }
        }

        return result;
    }

    static toRecord = (obj: unknown): Record<string, unknown> | undefined => {
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
            return obj as Record<string, unknown>;
        }
        return undefined;
    }
}