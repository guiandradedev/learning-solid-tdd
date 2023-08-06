import { IHashAdapter } from "@/modules/user/adapters/hash/hash";

export class InMemoryHashAdapter implements IHashAdapter {
    async hash(value: string): Promise<string> {
        return 'hashed_value'
    }
    async compare(previous: string, original: string): Promise<boolean> {
        return true;
    }
}