
export class StringUtil {

    /** @deprecated */
    static checkEmpty = (text?: string | null, rewriteText?: string) => {
        if (text === undefined || text === null || text.trim() === '') {
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
            classNames += ` ${addClass}`
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

    static randomString = (length : number) => {
        const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        for (let i = 0; i < length; i++) {
            result += alphanumericChars.charAt(Math.floor(Math.random() * alphanumericChars.length));
        }
        return result;
    }
}