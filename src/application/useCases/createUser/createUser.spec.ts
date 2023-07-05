import { describe, it, expect } from "vitest";
import { InMemoryUsersRepository } from "../../../tests/repositories/in-memory-user-repository";
import { CreateUserUseCase } from "./createUserUseCase";
import { User } from "../../../domain/entities/user";
import { IUsersRepository } from "../../repositories/IUsersRepository";

describe('create an user', () => {

    const makeSut = (): { sut: CreateUserUseCase, usersRepository: IUsersRepository } => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new CreateUserUseCase(usersRepository)

        return { sut, usersRepository }
    }

    it('should create an user', async () => {
        const { sut } = makeSut()

        const user1 = await sut.execute({
            email: "flaamer@gmail.com",
            name: "Guilherme"
        })

        expect(user1).toBeInstanceOf(User)
    })

    it('should not create another user (throw an error)', async () => {
        const { sut } = makeSut()

        await sut.execute({
            email: "flaamer@gmail.com",
            name: "Guilherme"
        })

        expect(async () => await sut.execute({
            email: "flaamer@gmail.com",
            name: "Foguinho"
        })).rejects.toBeInstanceOf(Error)
    })
})