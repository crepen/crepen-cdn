import CryptoJS from 'crypto-js';

export class CrepenCryptoUtil {
    static decrypt = (encryptStr: string | undefined, secretKey: string): string | undefined => {
        try {
            const decryptStr = CryptoJS.AES.decrypt(encryptStr ?? '', secretKey).toString(CryptoJS.enc.Utf8);
            return decryptStr;
        }
        catch (e) {
            return undefined;
        }
    }

    static encrypt = (dataStr: string, secretKey: string): string | undefined => {
        try {
            const encryptStr = CryptoJS.AES.encrypt(dataStr, secretKey).toString();

            return encryptStr;
        }
        catch (e) {
            return undefined;
        }
    }
}