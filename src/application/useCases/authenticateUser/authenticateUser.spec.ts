import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { InMemoryUserTokenRepository } from "../../../tests/repositories/in-memory-user-token-repository";
import { InMemoryUsersRepository } from "../../../tests/repositories/in-memory-user-repository";
import { User } from "../../../domain/entities/user";
import { AuthenticateUserUseCase } from "./authenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { UserToken } from '../../../domain/entities/user-token';
import jwt from "jsonwebtoken";
import { TokensReturnsTest } from '../../services/sessionService.spec';
import { AppError } from '../../../shared/errors/AppError';

describe('Authentication', async () => {
    const makeSup = () => {
        const usersRepository = new InMemoryUsersRepository();
        const userTokenRepository = new InMemoryUserTokenRepository()
        const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository)
        const sut = new AuthenticateUserUseCase(usersRepository, userTokenRepository)

        return { sut, sutUser, usersRepository, userTokenRepository }
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

        expect(user.token).toBeInstanceOf(UserToken)
    })

    it('should return an access and refresh token VALIDS', async () => {
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

        const verifyAccess = jwt.verify(user.token.props.accessToken, process.env.JWT_ACCESS_TOKEN)
        expect(verifyAccess).toMatchObject<TokensReturnsTest>({
            exp: expect.any(Number),
            iat: expect.any(Number),
            sub: expect.any(String)
        })
        expect(verifyAccess.sub).toEqual(user.id)

        const verifyRefresh = jwt.verify(user.token.props.refreshToken, process.env.JWT_REFRESH_TOKEN)
        expect(verifyRefresh).toMatchObject<TokensReturnsTest>({
            exp: expect.any(Number),
            iat: expect.any(Number),
            sub: expect.any(String)
        })
        expect(verifyRefresh.sub).toEqual(user.id)
    })

    // it('should throw an error if ')
})