import { ErrInternalServerError, ErrTokenInvalid, ErrTokenNotProvided } from "../../../shared/errors"
import { SecurityDecryptResponse, SecurityAdapter } from "../../../shared/adapters"
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
        try {
            const data = jwt.verify(value, secret) as JwtPayload
            
            return this.mapper(data)
        } catch (error) {
            if(error instanceof Error) {
                if(error.message === "jwt expired" || error.message === "invalid signature") {
                    throw ErrTokenInvalid
                }
                if(error.message == 'jwt must be provided') {
                    throw ErrTokenNotProvided
                }
                throw ErrInternalServerError
            }
            throw ErrInternalServerError
        }
    }
}