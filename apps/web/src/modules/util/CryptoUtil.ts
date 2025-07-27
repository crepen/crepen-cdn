import { StringUtil } from '@web/lib/util/string.util';



export class CryptoSymmenticUtil {
    constructor(cryptoFunc?: Crypto) {
        this.cryptoFunc = cryptoFunc ?? new Crypto();
    }

    cryptoFunc: Crypto;
    private symmenticKey = 'nZVbavIyhkjEnRqU'

    static instance = (cryptoFunc?: Crypto) => {
        return new CryptoSymmenticUtil(cryptoFunc);
    }


    private toBase64(u8: Uint8Array): string {
        return btoa(String.fromCharCode(...u8));
    }

    private fromBase64(b64: string): Uint8Array {
        const binary = atob(b64);
        return Uint8Array.from(binary, (c) => c.charCodeAt(0));
    }


    private async getKey(secret: string): Promise<CryptoKey> {
        const encoder = new TextEncoder();


        const hash = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(secret));
        return globalThis.crypto.subtle.importKey(
            'raw',
            hash,
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
        );
    }

    encrypt = async (plaintext: string, secret: string = this.symmenticKey) => {
        const encoder = new TextEncoder();

        const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
        const key = await this.getKey(secret);
        const encoded = encoder.encode(plaintext);

        const cipherBuffer = await globalThis.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encoded
        );

        const ivBase64 = this.toBase64(iv);
        const cipherBase64 = this.toBase64(new Uint8Array(cipherBuffer));
        return `${ivBase64}:${cipherBase64}`;
    }

    decrypt = async (ciphertextWithIv: string, secret: string = this.symmenticKey): Promise<string | undefined> => {
        const decoder = new TextDecoder();

        if (typeof ciphertextWithIv !== 'string' || !ciphertextWithIv.includes(':')) return undefined;

        const [ivB64, cipherB64] = ciphertextWithIv.split(':');
        if (!ivB64 || !cipherB64) return undefined;

        try {
            const iv = this.fromBase64(ivB64);
            const cipherBytes = this.fromBase64(cipherB64);
            const key = await this.getKey(secret);

            const plainBuffer = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                key,
                cipherBytes
            );

            return decoder.decode(plainBuffer);
        } catch (err) {
            console.error('[Decrypt Error]', err);
            return undefined;
        }
    }
}