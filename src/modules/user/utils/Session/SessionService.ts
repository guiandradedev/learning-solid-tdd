import 'reflect-metadata'

import { ErrServerError } from '@/shared/errors';
import { ISecurityAdapter } from '@/modules/user/adapters';
import { ITokens } from "@/types/token.types";

class CreateSession {
    constructor(
        private securityAdapter: ISecurityAdapter
    ) { }
    async execute(email: string, _id: string): Promise<ITokens> {
        try {
            _id = _id.toString();

            const accessToken = this.securityAdapter.encrypt({}, process.env.ACCESS_TOKEN, {
                subject: _id,
                expiresIn: process.env.EXPIRES_IN_TOKEN,
            })

            const refreshToken = this.securityAdapter.encrypt({ email }, process.env.REFRESH_TOKEN, {
                subject: _id,
                expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN,
            });

            const refreshTokenExpiresDate = new Date(new Date().getTime() + Number(process.env.EXPIRES_IN_TOKEN))
            const accessTokenExpiresDate = new Date(new Date().getTime() + Number(process.env.EXPIRES_IN_REFRESH_TOKEN))

            return { accessToken, refreshToken, refreshTokenExpiresDate, accessTokenExpiresDate };

        } catch (error) {
            console.log(error)
            throw new ErrServerError()
        }
    }
}

export { CreateSession };