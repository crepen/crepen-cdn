import { ICookieData } from './type'
import CryptoJS from 'crypto-js';
import {DateTime} from 'luxon'



export const decryptData = (encryptCookieStr? : string) : ICookieData => {
    try{
        const secretKey = process.env.AUTH_SECRET ?? 'secret-key';
        const decryptStr = CryptoJS.AES.decrypt(encryptCookieStr ?? '' , secretKey).toString(CryptoJS.enc.Utf8);
        
        const decryptObj = JSON.parse(decryptStr);
        return decryptObj as ICookieData;
    }
    catch(e){
        return {};
    }
}

export const encrtypeData = (data? : ICookieData) => {
    const dataStr : string = JSON.stringify(data ?? {});
    const secretKey = process.env.AUTH_SECRET ?? 'secret-key';
    const encryptStr = CryptoJS.AES.encrypt(dataStr , secretKey).toString();

    return encryptStr;
}

export const isExpireUserSession = (encryptCookieStr? : string) => {

    

    const data = decryptData(encryptCookieStr ?? '');

    if(!data.user?.loginExpireTime){
        return true;
    }

    const expireTime = DateTime.fromMillis(data.user?.loginExpireTime ?? 0);

    console.log(expireTime.toISO(), expireTime < DateTime.now());

    if(expireTime >= DateTime.now()){
        return false;
    }

    return true;
}