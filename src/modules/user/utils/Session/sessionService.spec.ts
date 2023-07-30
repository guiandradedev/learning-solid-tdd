import 'dotenv/config'
import { describe, expect, it } from "vitest";
import { CreateSession } from "./SessionService";
import { ISecurityAdapter, SecurityDecryptResponse } from '@/modules/user/adapters';
import { InMemorySecurityAdapter } from '@/tests/adapters/InMemorySecurityAdapter';

describe("Session Service", async () => {
    type TypeSut = {
        securityAdapter: ISecurityAdapter
        createSession: CreateSession
    }
    const makeSut = (securityAdapter: ISecurityAdapter = new InMemorySecurityAdapter()): TypeSut => {
        const createSession = new CreateSession(securityAdapter)
        return { securityAdapter, createSession }
    }
    it('should create a valid token and refresh_token', async () => {
        const { createSession, securityAdapter } = makeSut()
        const userId = 'fake_user_id'
        const { accessToken, refreshToken } = await createSession.execute('fake_email@email.com', userId)

        const verifyAccess = securityAdapter.decrypt(accessToken, process.env.ACCESS_TOKEN)

        expect(verifyAccess).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Date),
            issuedAt: expect.any(Date),
            subject: userId
        })

        expect(verifyAccess.issuedAt.getTime()).toBeGreaterThanOrEqual(Date.now()-100)
        expect(verifyAccess.expiresIn.getTime()).toBeLessThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_TOKEN));

        const verifyRefresh = securityAdapter.decrypt(refreshToken, process.env.REFRESH_TOKEN)
        expect(verifyRefresh).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Date),
            issuedAt: expect.any(Date),
            subject: userId
        })
        expect(verifyAccess.issuedAt.getTime()).toBeGreaterThanOrEqual(Date.now() - 100);
        expect(verifyAccess.expiresIn.getTime()).toBeLessThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_TOKEN));
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