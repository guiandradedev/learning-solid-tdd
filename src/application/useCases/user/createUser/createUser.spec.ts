import 'dotenv/config'
import 'reflect-metadata'
import { describe, it, expect } from "vitest";
import { CreateUserUseCase } from "./createUserUseCase";
import { User } from "../../../../domain/entities/user";
import { AppError } from '../../../../shared/errors';
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '../../../../tests/adapters';
import { InMemoryUserTokenRepository, InMemoryUsersRepository } from '../../../../tests/repositories';
import { IUsersRepository } from '../../../repositories';


describe('create an user', () => {

    const makeSut = (): { sut: CreateUserUseCase, usersRepository: IUsersRepository } => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const sut = new CreateUserUseCase(usersRepository, userTokenRepository, hashAdapter, securityAdapter, mailAdapter)

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

        const dataUser = {
            email: "flaamer@gmail.com",
            name: "Foguinho",
            password: "teste123"
        }

        expect(async () => await sut.execute(dataUser)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataUser)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_USER_ALREADY_EXISTS"
            })
        );
    })
})