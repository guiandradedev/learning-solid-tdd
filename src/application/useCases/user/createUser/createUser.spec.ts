import 'dotenv/config'
import 'reflect-metadata'
import { describe, it, expect } from "vitest";
import { CreateUserUseCase } from "./createUserUseCase";
import { User } from "@/domain/entities";
import { AppError } from '@/shared/errors';
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters';
import { InMemoryUserCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository } from '@/tests/repositories';
import { IUsersRepository } from '../../../repositories';
import { ErrAlreadyExists } from '@/shared/errors';

export const createUserFactory = () => {
    const usersRepository = new InMemoryUsersRepository()
    const userTokenRepository = new InMemoryUserTokenRepository()
    const userCodeRepository = new InMemoryUserCodeRepository()
    const hashAdapter = new InMemoryHashAdapter();
    const securityAdapter = new InMemorySecurityAdapter()
    const mailAdapter = new InMemoryMailAdapter()
    const sut = new CreateUserUseCase(usersRepository, userTokenRepository, userCodeRepository, hashAdapter, securityAdapter, mailAdapter)

    return {
        usersRepository,
        userTokenRepository,
        userCodeRepository,
        hashAdapter,
        securityAdapter,
        mailAdapter,
        sut
    }
}


describe('create an user', () => {

    it('should create an user', async () => {
        const { sut } = createUserFactory()

        const user1 = await sut.execute({
            email: "flaamer@gmail.com",
            name: "Guilherme",
            password: "teste123"
        })

        expect(user1).toBeInstanceOf(User)
    })

    it('should not create another user (throw an error)', async () => {
        const { sut } = createUserFactory()

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
        expect(async () => await sut.execute(dataUser)).rejects.toBeInstanceOf(ErrAlreadyExists)
    })
})