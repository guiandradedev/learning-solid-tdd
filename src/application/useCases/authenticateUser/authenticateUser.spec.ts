import 'reflect-metadata'

import { describe, expect, it } from "vitest";
import { InMemoryUserTokenRepository } from "../../../tests/repositories/in-memory-user-token-repository";
import { InMemoryUsersRepository } from "../../../tests/repositories/in-memory-user-repository";
import { User } from "../../../domain/entities/user";
import { AuthenticateUserUseCase } from "./authenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/createUserUseCase";

describe('Authentication', async () => {
    const makeSup = () => {
        const usersRepository = new InMemoryUsersRepository();
        const sutUser = new CreateUserUseCase(usersRepository)
        const userTokenRepository = new InMemoryUserTokenRepository()
        const sut = new AuthenticateUserUseCase(usersRepository, userTokenRepository)
        
        return {sut, sutUser, usersRepository, userTokenRepository}
    }
    it('Authenticate User', async () => {
        const {sutUser, sut} = makeSup();

        const user1 = await sutUser.execute({
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
        const {sut} = makeSup()

        expect(async () => await sut.execute({
            email: "fake_email@email.com",
            password: "fake_password"
        })).rejects.toThrowError("User or password incorrect")
    })

    it('Should throw an error if password != user.password', async () => {
        const {sut, sutUser} = makeSup()

        await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123"
        })

        expect(async () => await sut.execute({
            email: "fake_email@email.com",
            password: "fake_password"
        })).rejects.toThrowError("User or password incorrect")
    })

    it('should return an access and refresh token valids', async () => {
        
    })
})