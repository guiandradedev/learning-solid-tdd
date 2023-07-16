import { HashAdapter } from "./hash";

export class BcryptHashAdapter implements HashAdapter {
    async compare(previous: string, original: string): Promise<boolean> {
        return true
    }
    async hash(value: string): Promise<string> {
        return ''
    }
}