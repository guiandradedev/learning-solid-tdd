import 'reflect-metadata'

import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import { ITokens } from "../../@types/token.types";

class CreateSession {
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

            const refreshTokenExpiresDate = dayjs()
                .add(process.env.JWT_EXPIRES_REFRESH_TOKEN_DAYS, "days")
                .toDate();

            const accessTokenExpiresDate = dayjs().add(parseInt(process.env.JWT_EXPIRES_IN_TOKEN), 'day').toDate();

            return { accessToken, refreshToken, refreshTokenExpiresDate, accessTokenExpiresDate };

        } catch (error) {
            console.log(error)
            throw new Error("token")
        }
    }
}

export { CreateSession };