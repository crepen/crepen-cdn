
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';


@Injectable()
export class CrepenCryptoService {


    constructor(
        private readonly configService: ConfigService
    ) {
    }

    private readonly algorithm = 'aes-256-cbc';



    encryptFile = async (file: Express.Multer.File, convertName: string): Promise<{ file: Express.Multer.File, encryptMime: string }> => {

        const key: Buffer = crypto.scryptSync(this.configService.get('secret.file'), 'salt', 32); // 32 byte key

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);

        const encryptFileBuffer = Buffer.concat([cipher.update(file.buffer), cipher.final()]);

        const encryptFile: Express.Multer.File = {
            ...file,
            buffer: Buffer.from(encryptFileBuffer.toString('hex'), 'hex'),
            size: encryptFileBuffer.length,
            originalname: await this.hashText(convertName),
        }

        file.buffer = undefined;
        const fileMineJson = JSON.stringify(file);

        const cipherTxt = crypto.createCipheriv(this.algorithm, key, iv);
        const encryptFileMine = Buffer.concat([cipherTxt.update(fileMineJson, 'utf8'), cipherTxt.final()]);
        const encryptMimeStr = iv.toString('hex') + ":" + encryptFileMine.toString('hex');

        return {
            file: encryptFile,
            encryptMime: encryptMimeStr
        }
    }

    decryptFile = (fileBuffer: Buffer, originMime: string  ): { file: Express.Multer.File, decryptMime: string } => {

        const key: Buffer = crypto.scryptSync(this.configService.get('secret.file'), 'salt', 32); // 32 byte key

        // MIME
        const mimeHexString = originMime;
        const [mimeIvHex, mimeDataHex] = mimeHexString.split(':');
        const mimeIv = Buffer.from(mimeIvHex, 'hex');
        const encryptMimeBuffer = Buffer.from(mimeDataHex, 'hex');
        const mimeDecipher = crypto.createDecipheriv(this.algorithm, key, mimeIv);
        const decryptMime = Buffer.concat([mimeDecipher.update(encryptMimeBuffer), mimeDecipher.final()]);



        // FILE
        const fileBufferHexString = fileBuffer.toString('hex');
        const encrypted = Buffer.from(fileBufferHexString, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, key, mimeIv);
        const decryptFile = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        const originFileMime = JSON.parse(decryptMime.toString('utf8')) as Express.Multer.File

        const decryptFileObj: Express.Multer.File = {
            ...originFileMime,
            buffer: decryptFile,
            filename : originFileMime.originalname
        }

        return {
            decryptMime: decryptMime.toString('utf8'),
            file: decryptFileObj
        }
    }

    encryptStoreFileName = (fileName: string): string => {
        const key: Buffer = crypto.scryptSync(this.configService.get('secret.file'), 'salt', 32); // 32 byte key

        const iv = crypto.randomBytes(16);
        const cipherTxt = crypto.createCipheriv(this.algorithm, key, iv);
        const encryptFileNameStr = Buffer.concat([cipherTxt.update(fileName, 'utf8'), cipherTxt.final()]);
        const encryptStr = iv.toString('hex') + "-" + encryptFileNameStr.toString('hex');

        return encryptStr
    }

    decryptStoreFileName = (fileName: string): string => {
        const key: Buffer = crypto.scryptSync(this.configService.get('secret.file'), 'salt', 32); // 32 byte key

        const [iv, strHex] = fileName.split('-');
        const mimeIv = Buffer.from(iv, 'hex');
        const encryptBuffer = Buffer.from(strHex, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, key, mimeIv);
        const decryptStr = Buffer.concat([decipher.update(encryptBuffer), decipher.final()]).toString('utf8');

        return decryptStr;
    }

    hashText = async (text: string): Promise<string> => {
        return crypto.createHash('sha512').update(text).digest('hex');
    }
}