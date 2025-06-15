import { ICookieData } from './type'
import CryptoJS from 'crypto-js';
import { DateTime } from 'luxon'




/** @deprecated */
export const decryptData = <T>(encryptCookieStr?: string): T | undefined => {
    try {
        const secretKey = process.env.AUTH_SECRET ?? 'secret-key';
        const decryptStr = CryptoJS.AES.decrypt(encryptCookieStr ?? '', secretKey).toString(CryptoJS.enc.Utf8);

        const decryptObj = JSON.parse(decryptStr);
        return decryptObj as T;
    }
    catch (e) {
        return undefined;
    }
}

/** @deprecated */
export const encrtypeData = (data?: object) => {
    const dataStr: string =  JSON.stringify(data ?? {});
    const secretKey = process.env.AUTH_SECRET ?? 'secret-key';
    const encryptStr = CryptoJS.AES.encrypt(dataStr, secretKey).toString();

    return encryptStr;
}


