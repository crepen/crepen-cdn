
export class StringUtil {

    /** @deprecated */
    static checkEmpty = (text?: string | null, rewriteText?: string) => {
        if (text === undefined || text === null) {
            return rewriteText ?? undefined;
        }
        else if(typeof text === 'string' && text.trim() === ''){
            return rewriteText ?? undefined;
        }

        return text;
    }

    static shiftEmptyString = (text: string | undefined | null, rewriteText: string) => {
        if (text === undefined || text === null || text.trim() === '') {
            return rewriteText;
        }

        return text;
    }

    static joinClassName = (className: string | undefined, ...addClass: (string | undefined)[]) => {
        let classNames = className ?? '';
        for (const item of addClass) {
            classNames += ` ${item}`
            classNames = classNames.trim();
        }

        return classNames;
    }

    static isEmpty = (text?: string | null) => {
        if (this.checkEmpty(text) === undefined) {
            return true;
        }

        return false;
    }

    static randomString = (length: number) => {
        const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        for (let i = 0; i < length; i++) {
            result += alphanumericChars.charAt(Math.floor(Math.random() * alphanumericChars.length));
        }
        return result;
    }

    static getByteLength = (str: string) => {
        const charByteSize = (charValue : string) => {
            if (charValue == null || charValue.length == 0) {
                return 0
            }

            const charCode = charValue.charCodeAt(0)
            if (charCode <= 0x00007f) {
                return 1
            } else if (charCode <= 0x0007ff) {
                return 2
            } else if (charCode <= 0x00ffff) {
                return 3
            } else {
                return 4
            }
        }

        if (str == null || str.length === 0) {
            return 0
        }
        let size = 0
        for (let i = 0; i < str.length; i++) {
            size += charByteSize(str.charAt(i))
        }
        return size
    }
}