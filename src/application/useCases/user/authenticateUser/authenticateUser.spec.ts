import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { AppError } from '../../../../shared/errors';
import { InMemoryUserTokenRepository, InMemoryUsersRepository } from "../../../../tests/repositories";
import { AuthenticateUserUseCase, UserTokenResponse } from "./authenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { User, UserToken } from '../../../../domain/entities';
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '../../../../tests/adapters';
import { SecurityDecryptResponse } from '../../../../shared/adapters';

describe('Authentication', async () => {
    it('', () => { })

    const makeSup = () => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository, hashAdapter, securityAdapter, mailAdapter)
        const sut = new AuthenticateUserUseCase(usersRepository, userTokenRepository, hashAdapter, securityAdapter)

        return { sut, sutUser, usersRepository, userTokenRepository, securityAdapter, hashAdapter }
    }
    it('Authenticate User', async () => {
        const { sutUser, sut } = makeSup();

        await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123"
        })

        const user = await sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        expect(user).toBeInstanceOf(User)
    })

    it('Should throw an error if user does not exists', async () => {
        const { sut } = makeSup()

        const dataObj = {
            email: "fake_email@email.com",
            password: "fake_password"
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(User)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_USER_INVALID"
            })
        );
    })

    it('Should throw an error if password != user.password', async () => {
        const { sut, sutUser } = makeSup()

        await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123"
        })

        const dataObj = {
            email: "fake_email@email.com",
            password: "fake_password"
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(User)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_USER_INVALID"
            })
        );
    })

    it('should return an access and refresh token', async () => {
        const { sutUser, sut } = makeSup();

        await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123"
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
            password: "teste123"
        })

        const user = await sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        const verifyAccess = securityAdapter.decrypt(user.token.accessToken, process.env.ACCESS_TOKEN)

        expect(verifyAccess).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Number),
            issuedAt: expect.any(Number),
            subject: user.id
        })
        expect(verifyAccess.issuedAt).toBeGreaterThanOrEqual(Date.now() - 100);
        expect(verifyAccess.expiresIn).toBeLessThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_TOKEN));

        const verifyRefresh = securityAdapter.decrypt(user.token.refreshToken, process.env.REFRESH_TOKEN)
        expect(verifyRefresh).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Number),
            issuedAt: expect.any(Number),
            subject: user.id
        })
        expect(verifyAccess.issuedAt).toBeGreaterThanOrEqual(Date.now() - 100);
        expect(verifyAccess.expiresIn).toBeLessThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_TOKEN));
    })

    // it('should throw an error if ')
})