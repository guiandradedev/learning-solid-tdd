import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { ErrNotActive, ErrInvalidParam } from '@/shared/errors';
import { InMemoryUserCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository } from "@/tests/repositories";
import { AuthenticateUserUseCase } from "./authenticateUserUseCase";
import { CreateUserUseCase } from "@/modules/user/services/createUser/createUserUseCase";
import { User } from '@/modules/user/domain';
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters';
import { SecurityDecryptResponse } from '@/modules/user/adapters';
import { UserTokenResponse } from '@/modules/user/protocols';

describe('Authentication', async () => {
    it('', () => { })

    const makeSup = () => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository, userCodeRepository, hashAdapter, securityAdapter, mailAdapter)
        const sut = new AuthenticateUserUseCase(usersRepository, userTokenRepository, hashAdapter, securityAdapter)

        return { sut, sutUser, usersRepository, userTokenRepository, securityAdapter, hashAdapter }
    }
    it('Authenticate User', async () => {
        const { sutUser, sut } = makeSup();

        await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
            active: true
        })

        const user = await sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        expect(user).toBeInstanceOf(User)
    })

    it('should throw an error if user is not active', async () => {
        const { sutUser, sut } = makeSup();

        await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123"
        })

        const user = sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        expect(user).rejects.toBeInstanceOf(ErrNotActive)
    })

    it('Should throw an error if user does not exists', async () => {
        const { sut } = makeSup()

        const dataObj = {
            email: "fake_email@email.com",
            password: "fake_password"
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(User)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(ErrInvalidParam)
    })

    it('Should throw an error if password != user.password', async () => {
        const { sut, sutUser } = makeSup()

        await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
            active: true
        })

        const dataObj = {
            email: "fake_email@email.com",
            password: "fake_password"
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(User)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(ErrInvalidParam)
    })

    it('should return an access and refresh token', async () => {
        const { sutUser, sut } = makeSup();

        await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
            active: true
        })

        const user = await sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        expect(user.token).toMatchObject<UserTokenResponse>({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })
    })

    it('should return an access and refresh token VALIDS', async () => {
        const { sutUser, sut, securityAdapter } = makeSup();

        await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
            active: true
        })

        const user = await sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        const verifyAccess = securityAdapter.decrypt(user.token.accessToken, process.env.ACCESS_TOKEN)

        expect(verifyAccess).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Date),
            issuedAt: expect.any(Date),
            subject: user.id
        })
        expect(verifyAccess.issuedAt.getTime()).toBeGreaterThanOrEqual(Date.now() - 100);
        expect(verifyAccess.expiresIn.getTime()).toBeLessThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_TOKEN));

        const verifyRefresh = securityAdapter.decrypt(user.token.refreshToken, process.env.REFRESH_TOKEN)
        expect(verifyRefresh).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Date),
            issuedAt: expect.any(Date),
            subject: user.id
        })
        expect(verifyAccess.issuedAt.getTime()).toBeGreaterThanOrEqual(Date.now() - 100);
        expect(verifyAccess.expiresIn.getTime()).toBeLessThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_TOKEN));
    })

})