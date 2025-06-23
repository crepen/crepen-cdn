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

    static isMatch = (text1?: string | null, text2?: string | null) => {
        try {
            const targetText1 = (text1 ?? undefined)?.toString().trim();
            const targetText2 = (text2 ?? undefined)?.toString().trim();

            if (targetText1 === targetText2) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }

    }

    static convertFormatByte = (bytes : number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

}