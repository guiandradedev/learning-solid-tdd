import 'dotenv/config'
import 'reflect-metadata'
import { describe, it, expect } from "vitest";
import { InMemoryUsersRepository } from "../../../tests/repositories/in-memory-user-repository";
import { CreateUserUseCase } from "./createUserUseCase";
import { User } from "../../../domain/entities/user";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUserTokenRepository } from '../../../tests/repositories/in-memory-user-token-repository';


describe('create an user', () => {

    const makeSut = (): { sut: CreateUserUseCase, usersRepository: IUsersRepository } => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const sut = new CreateUserUseCase(usersRepository,userTokenRepository)

        return { sut, usersRepository }
    }

    it('should create an user', async () => {
        const { sut } = makeSut()

        const user1 = await sut.execute({
            email: "flaamer@gmail.com",
            name: "Guilherme",
            password: "teste123"
        })

        expect(user1).toBeInstanceOf(User)
    })

    it('should not create another user (throw an error)', async () => {
        const { sut } = makeSut()

        await sut.execute({
            email: "flaamer@gmail.com",
            name: "Guilherme",
            password: "teste123"
        })

        expect(async () => await sut.execute({
            email: "flaamer@gmail.com",
            name: "Foguinho",
            password: "teste123"
        })).rejects.toBeInstanceOf(Error)
    })
})