export interface HashAdapter {
    hash(value: string): Promise<string>;
    compare(previous: string, original: string): Promise<boolean>
}