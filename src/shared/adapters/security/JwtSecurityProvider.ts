import { SecurityDecryptResponse, SecurityAdapter } from "shared/adapters"
import jwt, { JwtPayload } from 'jsonwebtoken'

interface EncryptOptions {
    subject: string,
    expiresIn: Date
}

export class JwtSecurityAdapter implements SecurityAdapter {
    private mapper(data: JwtPayload): SecurityDecryptResponse {
        return {
            expiresIn: data.exp,
            issuedAt: data.exp,
            // payload: data.
            subject: data.sub
        }
    }
    encrypt(data: any, secret: string, options: any): string {
        return jwt.sign(data, secret, options)
    }
    decrypt(value: string, secret: string): SecurityDecryptResponse {
        const data = jwt.verify(value, secret) as JwtPayload
        return this.mapper(data)
    }
}