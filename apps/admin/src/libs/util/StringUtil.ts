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

        const classList = [];

        if (!StringUtil.isEmpty(className)) {
            classList.push(className?.trim());
        }

        for (const classItem of addClass) {
            for (const splitClassItem of (classItem?.split(' ') ?? [])) {
                if (classList.indexOf(splitClassItem) === -1) {
                    if (!StringUtil.isEmpty(splitClassItem)) {
                        classList.push(splitClassItem.trim());
                    }
                }
            }

        }


        return classList.join(' ');
    }

    static isEmpty = (text?: string | null) => {
        if (text === undefined || text === null || text.trim() === '') {
            return true;
        }
        else {
            return false;
        }
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (_) {
            return false;
        }

    }

    static convertFormatByte = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }


    static randomString = (length: number) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
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