import { CrepenConfig } from "@crepen-nest/interface/config"
import { CryptoUtil, StringUtil } from "@crepen-nest/lib/util";

export class StoreConfigExtension {
    static encrypt = (config: CrepenConfig): Buffer => {
        
        const configStr = CryptoUtil.Symmentic.encrypt(JSON.stringify(config), config.secret);
        const secretLength = (config.secret ?? '').length + 5;
        const checksumStr = StringUtil.randomCharString(15 - secretLength.toString().length);
        const lengthBuffer = Buffer.from(checksumStr + secretLength.toString());
        const secretBuffer = Buffer.from(config.secret ?? '');
        const configBuffer = Buffer.from(configStr);

        const saveBuffer = Buffer.concat([lengthBuffer, secretBuffer, configBuffer]);

        return saveBuffer;
    }

    static decrypt = (configBuffer: Buffer): CrepenConfig => {
        const secretLengthMatchArray = configBuffer.subarray(0, 15).toString('utf8').match(/\d/g);

        const secretLength = parseInt(secretLengthMatchArray.join(''), 10) - 5;

        const sliceSecretBuffer = configBuffer.subarray(15, secretLength + 15);
        const sliceConfigBuffer = configBuffer.subarray(secretLength + 15)
        const decryptConfig = CryptoUtil.Symmentic.decrypt(
            sliceConfigBuffer.toString('utf8'),
            sliceSecretBuffer.toString('utf8')
        )


        return JSON.parse(decryptConfig) as CrepenConfig;
    }
}