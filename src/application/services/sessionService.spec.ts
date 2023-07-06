import 'dotenv/config'
import { describe, expect, it } from "vitest";
import { CreateSession } from "./SessionService";
import jwt from "jsonwebtoken";

export type TokensReturnsTest = {
    exp: number;
    iat: number;
    sub: string
};

describe("Session Service", async () => {
    it('should create a valid token and refresh_token', async () => {
        const createSession = new CreateSession()
        const userId = 'fake_user_id'
        const { accessToken, refreshToken } = await createSession.execute('fake_email@email.com', userId)

        const verifyAccess = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN)
        expect(verifyAccess).toMatchObject<TokensReturnsTest>({
            exp: expect.any(Number),
            iat: expect.any(Number),
            sub: expect.any(String)
        })
        expect(verifyAccess.sub).toEqual(userId)

        const verifyRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN)
        expect(verifyRefresh).toMatchObject<TokensReturnsTest>({
            exp: expect.any(Number),
            iat: expect.any(Number),
            sub: expect.any(String)
        })
        expect(verifyRefresh.sub).toEqual(userId)
    })
})