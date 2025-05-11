import * as bcrypt from 'bcrypt';

export class EncryptUtil {
    static async hashPassword(password: string): Promise<string> {
        const saltRounds: number = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}