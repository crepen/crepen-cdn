import { StringUtil } from '@web/lib/util/string.util';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export class NodeCryptoUtil {

    private static symmenticKey = 'nZVbavIyhkjEnRqU'
    private static symmenticAlgorithm = 'aes-256-cbc';

    // static async getKey(secret: string): Promise<CryptoKey> {
    //     const encoder = new TextEncoder();


    //     const hash = await crypto.subtle.digest('SHA-256', encoder.encode(secret));
    //     return crypto.subtle.importKey(
    //         'raw',
    //         hash,
    //         { name: 'AES-GCM' },
    //         false,
    //         ['encrypt', 'decrypt']
    //     );
    // }


    // // base64 helpers
    // private static toBase64(u8: Uint8Array): string {
    //     return btoa(String.fromCharCode(...u8));
    // }

    // private static fromBase64(b64: string): Uint8Array {
    //     const binary = atob(b64);
    //     return Uint8Array.from(binary, (c) => c.charCodeAt(0));
    // }

    // static Symmentic = {
    //     encrypt: async (plaintext: string, secret: string = this.symmenticKey): Promise<string> => {
    //         const encoder = new TextEncoder();

    //         const iv = crypto.getRandomValues(new Uint8Array(12));
    //         const key = await this.getKey(secret);
    //         const encoded = encoder.encode(plaintext);

    //         const cipherBuffer = await crypto.subtle.encrypt(
    //             { name: 'AES-GCM', iv },
    //             key,
    //             encoded
    //         );

    //         const ivBase64 = this.toBase64(iv);
    //         const cipherBase64 = this.toBase64(new Uint8Array(cipherBuffer));
    //         return `${ivBase64}:${cipherBase64}`;
    //     },
    //     decrypt: async (ciphertextWithIv: string, secret: string = this.symmenticKey): Promise<string | undefined> => {
    //         const decoder = new TextDecoder();

    //         if (typeof ciphertextWithIv !== 'string' || !ciphertextWithIv.includes(':')) return undefined;

    //         const [ivB64, cipherB64] = ciphertextWithIv.split(':');
    //         if (!ivB64 || !cipherB64) return undefined;

    //         try {
    //             const iv = this.fromBase64(ivB64);
    //             const cipherBytes = this.fromBase64(cipherB64);
    //             const key = await this.getKey(secret);

    //             const plainBuffer = await crypto.subtle.decrypt(
    //                 { name: 'AES-GCM', iv },
    //                 key,
    //                 cipherBytes
    //             );

    //             return decoder.decode(plainBuffer);
    //         } catch (err) {
    //             console.error('[Decrypt Error]', err);
    //             return undefined;
    //         }
    //     }
    // }


    static Symmentic = {

        encrypt: (text: string , secretKey : string = this.symmenticKey): string => {
            const iv = crypto.randomBytes(16);

            const key = crypto.createHash('sha256').update(secretKey).digest();

            const cipher = crypto.createCipheriv(NodeCryptoUtil.symmenticAlgorithm, key, iv);
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return `${iv.toString('hex')}:${encrypted}`;
        },
        decrypt: (encryptedString: string, secretKey : string = this.symmenticKey): string | undefined => {
            const key = crypto.createHash('sha256').update(secretKey).digest();

            const [ivHex, encryptedData] = encryptedString.split(':');
            if(StringUtil.isEmpty(ivHex) || StringUtil.isEmpty(encryptedData)){
                return undefined;
            }
            const iv = Buffer.from(ivHex!, 'hex');
            const decipher = crypto.createDecipheriv(NodeCryptoUtil.symmenticAlgorithm, key, iv);
            let decrypted = decipher.update(encryptedData!, 'hex', 'utf8');
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