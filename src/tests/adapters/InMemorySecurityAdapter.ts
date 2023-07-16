import { SecurityDecryptResponse, SecurityAdapter } from "../../shared/adapters";
import { v4 as uuidv4 } from 'uuid'

interface EncryptOptions {
    subject: string,
    expiresIn: number
}

interface Tokens extends SecurityDecryptResponse {
    id: string
}

export class InMemorySecurityAdapter implements SecurityAdapter {
    private tokens: Tokens[] = []
    encrypt(data: any, secret: string, options: EncryptOptions): string {
        const token = {
            id: uuidv4(),
            subject: options.subject,
            expiresIn: Date.now() + Number(options.expiresIn),
            issuedAt: Date.now()
        }
        this.tokens.push(token)
        return token.id;
    }
    decrypt(value: string, secret: string): SecurityDecryptResponse {
        const data = this.tokens.find(token=>token.id == value)

        if(!data) return null

        return {
            subject: data.subject,
            expiresIn: data.expiresIn,
            issuedAt: data.issuedAt
        }
    }
}