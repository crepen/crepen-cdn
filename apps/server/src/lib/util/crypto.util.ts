import { StringUtil } from "./string.util";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export class CryptoUtil {

    private static symmenticKey = 'nZVbavIyhkjEnRqU'
    private static symmenticAlgorithm = 'aes-256-cbc';

    static Symmentic = {

        encrypt: (text: string): string => {
            const iv = crypto.randomBytes(16);

            const key = crypto.createHash('sha256').update(CryptoUtil.symmenticKey).digest();

            const cipher = crypto.createCipheriv(CryptoUtil.symmenticAlgorithm, key, iv);
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return `${iv.toString('hex')}:${encrypted}`;
        },
        decrypt: (encryptedString: string): string => {
            const key = crypto.createHash('sha256').update(CryptoUtil.symmenticKey).digest();

            const [ivHex, encryptedData] = encryptedString.split(':');
            const iv = Buffer.from(ivHex, 'hex');
            const decipher = crypto.createDecipheriv(CryptoUtil.symmenticAlgorithm, key, iv);
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
    }

    static Hash = {
        encrypt: async (text: string): Promise<string> => {
            const saltRounds: number = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            return await bcrypt.hash(text, salt);
        },
        compare: async (text: string, encryptText: string): Promise<boolean> => {
            if (StringUtil.isEmpty(text)) return false;
            if (StringUtil.isEmpty(encryptText)) return false;
            return await bcrypt.compare(text, encryptText);
        }
    }
}