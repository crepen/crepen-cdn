import * as bcrypt from 'bcrypt';
import { StringUtil } from './string.util';

export class EncryptUtil {
    static async hashPassword(password: string): Promise<string> {
        const saltRounds: number = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        if (StringUtil.isEmpty(password)) return false;
        if (StringUtil.isEmpty(hash)) return false;
        return await bcrypt.compare(password, hash);
    }
}