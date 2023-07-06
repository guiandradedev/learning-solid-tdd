import 'reflect-metadata'

import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import { ITokens } from "../../@types/token.types";
import { inject, injectable } from "tsyringe";
import { IUserTokenRepository } from "../repositories/IUserTokenRepository";
import { UserToken } from '../../domain/entities/user-token';

@injectable()
class CreateSession {
    constructor(
        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository
    ) { }
    async execute(email: string, _id: string): Promise<ITokens> {
        try {
            _id = _id.toString();

            const accessToken = jwt.sign({}, process.env.JWT_ACCESS_TOKEN, {
                subject: _id,
                expiresIn: process.env.JWT_EXPIRES_IN_TOKEN,
            });

            const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_TOKEN, {
                subject: _id,
                expiresIn: process.env.JWT_EXPIRES_IN_REFRESH_TOKEN,
            });

            const refresh_token_expires_date = dayjs()
                .add(process.env.JWT_EXPIRES_REFRESH_TOKEN_DAYS, "days")
                .toDate();

            const userToken = UserToken.create({
                createdAt: new Date(),
                expiresDate: refresh_token_expires_date,
                refreshToken,
                userId: _id
            })

            await this.userTokenRepository.create(userToken)

            return { accessToken, refreshToken };

        } catch (error) {
            console.log(error)
            throw new Error("token")
        }
    }
}

export { CreateSession };