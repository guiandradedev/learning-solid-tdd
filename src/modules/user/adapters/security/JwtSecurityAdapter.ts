import { ErrInvalidParam, ErrMissingParam, ErrServerError } from "@/shared/errors"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ISecurityAdapter, SecurityDecryptResponse } from "./security"

interface EncryptOptions {
    subject: string,
    expiresIn: Date
}

export class JwtSecurityAdapter implements ISecurityAdapter {
    private mapper(data: JwtPayload): SecurityDecryptResponse {
        return {
            expiresIn: new Date(data.exp),
            issuedAt: new Date(data.iat),
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
                    throw new ErrInvalidParam('token')
                }
                if(error.message == 'jwt must be provided') {
                    throw new ErrMissingParam('token')
                }
                throw new ErrServerError()
            }
            throw new ErrServerError()
        }
    }
}