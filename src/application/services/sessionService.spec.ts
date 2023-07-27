import 'dotenv/config'
import { describe, expect, it, vitest } from "vitest";
import { CreateSession } from "./SessionService";
import { SecurityAdapter, SecurityDecryptResponse } from '../../shared/adapters';
import { InMemorySecurityAdapter } from '../../tests/adapters/InMemorySecurityAdapter';

describe("Session Service", async () => {
    type TypeSut = {
        securityAdapter: SecurityAdapter
        createSession: CreateSession
    }
    const makeSut = (securityAdapter: SecurityAdapter = new InMemorySecurityAdapter()): TypeSut => {
        const createSession = new CreateSession(securityAdapter)
        return { securityAdapter, createSession }
    }
    it('should create a valid token and refresh_token', async () => {
        const { createSession, securityAdapter } = makeSut()
        const userId = 'fake_user_id'
        const { accessToken, refreshToken } = await createSession.execute('fake_email@email.com', userId)

        const verifyAccess = securityAdapter.decrypt(accessToken, process.env.ACCESS_TOKEN)

        expect(verifyAccess).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Number),
            issuedAt: expect.any(Number),
            subject: userId
        })
        expect(verifyAccess.issuedAt).toBeGreaterThanOrEqual(Date.now() - 100);
        expect(verifyAccess.expiresIn).toBeLessThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_TOKEN));

        const verifyRefresh = securityAdapter.decrypt(refreshToken, process.env.REFRESH_TOKEN)
        expect(verifyRefresh).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Number),
            issuedAt: expect.any(Number),
            subject: userId
        })
        expect(verifyAccess.issuedAt).toBeGreaterThanOrEqual(Date.now() - 100);
        expect(verifyAccess.expiresIn).toBeLessThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_TOKEN));
    })

    it('should throw an error if an adapter error occurs', async () => {
        // const { createSession, securityAdapter } = makeSut()
        // const userId = 'fake_user_id'

        // vitest.spyOn(securityAdapter, 'encrypt').mockRejectedValueOnce(new Error())

        // const a = await createSession.execute('fake_email@email.com', userId)

        // console.log(a)

        // expect(a).toBeInstanceOf(AppError)

        
    })
})