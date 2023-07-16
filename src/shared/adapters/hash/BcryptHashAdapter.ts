import { HashAdapter } from "./hash";
import bcrypt from 'bcrypt'

export class BcryptHashAdapter implements HashAdapter {
    public readonly salt: number;
    constructor(_salt: number) {
        this.salt = _salt;
    }

    async hash(value: string): Promise<string> {
        return bcrypt.hash(value, this.salt)
    }
    async compare(previous: string, original: string): Promise<boolean> {
        return await bcrypt.compare(previous, original);
    }
}