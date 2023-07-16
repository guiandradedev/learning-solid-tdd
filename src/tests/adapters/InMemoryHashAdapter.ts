import { HashAdapter } from "../../shared/adapters/hash/hash";

export class InMemoryHashAdapter implements HashAdapter {
    async hash(value: string): Promise<string> {
        return 'hashed_value'
    }
    async compare(previous: string, original: string): Promise<boolean> {
        return true;
    }
}