export class ObjectUtil {
    static isObject = (item: any): item is Record<string, any> => {
        return item && typeof item === 'object' && !Array.isArray(item);
    }


    static deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
        const result: Record<string, unknown> = { ...base };

        for (const key in override) {
            if (Object.prototype.hasOwnProperty.call(override, key)) {
                const baseValue = base[key];
                const overrideValue = override[key];

                if (this.isObject(baseValue) && this.isObject(overrideValue)) {
                    result[key] = this.deepMerge(baseValue, overrideValue); // 재귀
                } else if (overrideValue !== undefined) {
                    result[key] = overrideValue;
                }
            }
        }

        return result;
    }
}