import 'reflect-metadata'

import { describe, expect, it, vitest } from "vitest";
import { CreateUserResponse, CreateUserUseCase } from "../createUser/createUserUseCase";
import { IUsersRepository } from "@/application/repositories";
import { InMemoryUserCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository } from "@/tests/repositories";
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from "@/tests/adapters";
import { UserCode, User } from '@/domain/entities';
import { ActivateUserUseCase } from './activateUserUseCase';
import { ErrInvalidParam, ErrNotFound } from '@/shared/errors';
import { GenerateUserCode } from '../../../services/GenerateUserCode';
import { ErrExpired } from '@/shared/errors/ErrExpired';

describe("ActivateUserCode", () => {
    const makeSut = async (): Promise<{ sut: ActivateUserUseCase, usersRepository: IUsersRepository, user: CreateUserResponse }> => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository, userCodeRepository, hashAdapter, securityAdapter, mailAdapter)

        const user = await sutUser.execute({
            name: "Flaamer",
            email: "teste@teste.com",
            password: "teste123"
        })

        const sut = new ActivateUserUseCase(usersRepository, userCodeRepository, mailAdapter)

        return { sut, usersRepository, user }
    }
    it('should activate an user if code is valid', async () => {
        const { sut, user } = await makeSut();

        const code = await sut.execute({
            userId: user.id,
            code: user.code.code
        })

        expect(code).toBeInstanceOf(UserCode)
    })

    it('should throw an error if user does not exists', async () => {
        const { sut, user } = await makeSut();

        const code = sut.execute({
            userId: 'fake_user_id',
            code: user.code.code
        })

        expect(code).rejects.toBeInstanceOf(ErrNotFound)
    })

    it('should throw an error if user code not exists', async () => {
        const { sut, user } = await makeSut();

        const code = sut.execute({
            userId: user.id,
            code: "fake_code"
        })

        expect(code).rejects.toBeInstanceOf(ErrInvalidParam)
    })

    it('should throw an error if code expired', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository, userCodeRepository, hashAdapter, securityAdapter, mailAdapter)

        const generateActivateCode = vitest.spyOn(GenerateUserCode.prototype, 'execute')
        const date = new Date()
        date.setDate(date.getDate() - 1)
        generateActivateCode.mockImplementation(() => { return { code: '', expiresIn: date } });

        const user = await sutUser.execute({
            name: "Flaamer",
            email: "teste@teste.com",
            password: "teste123"
        })

        const sut = new ActivateUserUseCase(usersRepository, userCodeRepository, mailAdapter)

        const code = sut.execute({
            userId: user.id,
            code: user.code.code
        })

        expect(code).rejects.toBeInstanceOf(ErrExpired)

    })

})