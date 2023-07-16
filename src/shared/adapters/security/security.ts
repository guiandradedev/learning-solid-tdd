export type SecurityDecryptResponse = {
    subject: string,
    // payload: any,
    expiresIn: number,
    issuedAt: number
}

export interface SecurityAdapter {
    encrypt(data: any, secret: string, options: any): string;
    decrypt(value: string, secret: string): SecurityDecryptResponse;
}