import { StringUtil } from "./string.util";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Readable } from "stream";

export class CryptoUtil {

    private static symmenticKey = 'nZVbavIyhkjEnRqU'
    private static symmenticAlgorithm = 'aes-256-cbc';

    static Symmentic = {

        encrypt: (text: string, key?: string): string => {
            const iv = crypto.randomBytes(16);

            const cipher = crypto.createCipheriv(
                CryptoUtil.symmenticAlgorithm,
                crypto.createHash('sha256').update(key ?? CryptoUtil.symmenticKey).digest(),
                iv
            );
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return `${iv.toString('hex')}:${encrypted}`;
        },
        decrypt: (encryptedString: string, key?: string): string => {
            const [ivHex, encryptedData] = encryptedString.split(':');
            const iv = Buffer.from(ivHex, 'hex');
            const decipher = crypto.createDecipheriv(
                CryptoUtil.symmenticAlgorithm,
                crypto.createHash('sha256').update(key ?? CryptoUtil.symmenticKey).digest(),
                iv
            );
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
    }

    static File = {
        encrypt: async (fileBuffer: Buffer<ArrayBufferLike>, key?: string) => {
            const iv = crypto.randomBytes(16);

            const cipher = crypto.createCipheriv(
                CryptoUtil.symmenticAlgorithm,
                crypto.createHash('sha256').update(key ?? CryptoUtil.symmenticKey).digest(),
                iv
            );

            const sourceStream = Readable.from(fileBuffer);
            const encryptedStream = sourceStream.pipe(cipher);


            const chunks = [];
            for await (const chunk of encryptedStream) {
                chunks.push(chunk);
            }

            const encryptedBuffer = Buffer.concat(chunks);

            return {
                iv: iv.toString(),
                buffer: encryptedBuffer
            }
        },
        decrypt: async (encryptFileBuffer: Buffer<ArrayBufferLike>, iv: string, key?: string) => {
            const sourceStream = Readable.from([encryptFileBuffer]);
            const decipher = crypto.createDecipheriv(
                this.symmenticAlgorithm,
                crypto.createHash('sha256').update(key ?? CryptoUtil.symmenticKey).digest(),
                iv
            );
            const decryptedStream = sourceStream.pipe(decipher);
            const chunks = [];
            for await (const chunk of decryptedStream) {
                chunks.push(chunk);   
            }


            const decryptedBuffer = Buffer.concat(chunks);

            return decryptedBuffer;
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