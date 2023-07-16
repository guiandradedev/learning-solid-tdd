import { HashAdapter } from "../../shared/adapters/hash/hash";

export class InMemoryHashAdapter implements HashAdapter {
    public readonly salt: number;
    constructor(_salt: number) {
        this.salt = _salt;
    }
    async hash(value: string): Promise<string> {
        return 'hashed_value'
    }
    async compare(previous: string, original: string): Promise<boolean> {
        return true;
    }
}