export interface IHashAdapter {
    hash(value: string): Promise<string>;
    compare(previous: string, original: string): Promise<boolean>
}