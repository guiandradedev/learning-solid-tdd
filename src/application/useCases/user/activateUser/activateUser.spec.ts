import 'reflect-metadata'

import { describe, expect, it, vitest } from "vitest";
import { CreateUserResponse, CreateUserUseCase } from "../createUser/createUserUseCase";
import { IUsersRepository } from "../../../../application/repositories";
import { InMemoryActivateCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository } from "../../../../tests/repositories";
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from "../../../../tests/adapters";
import { ActivateCode, User } from '../../../../domain/entities';
import { ActivateUserUseCase } from './activateUserUseCase';
import { AppError, ErrCodeExpired, ErrCodeInvalid, ErrUserNotFound } from '../../../../shared/errors';
import { GenerateActivateCode } from './GenerateActivateCode';

describe("ActivateUserCode", () => {
    const makeSut = async (): Promise<{ sut: ActivateUserUseCase, usersRepository: IUsersRepository, user: CreateUserResponse }> => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const activateCodeRepository = new InMemoryActivateCodeRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository, activateCodeRepository, hashAdapter, securityAdapter, mailAdapter)

        const user = await sutUser.execute({
            name: "Flaamer",
            email: "teste@teste.com",
            password: "teste123"
        })

        const sut = new ActivateUserUseCase(usersRepository, activateCodeRepository, mailAdapter)

        return { sut, usersRepository, user }
    }
    it('should activate an user if code is valid', async () => {
        const { sut, user } = await makeSut();

        const code = await sut.execute({
            userId: user.id,
            code: user.code.code
        })

        expect(code).toBeInstanceOf(ActivateCode)
    })

    it('should throw an error if user does not exists', async () => {
        const { sut, user } = await makeSut();

        const code = sut.execute({
            userId: 'fake_user_id',
            code: user.code.code
        })

        expect(code).rejects.toEqual(ErrUserNotFound)
    })

    it('should throw an error if user code not exists', async () => {
        const { sut, user } = await makeSut();

        const code = sut.execute({
            userId: user.id,
            code: "fake_code"
        })

        expect(code).rejects.toEqual(ErrCodeInvalid)
    })

    it('should throw an error if code expired', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const activateCodeRepository = new InMemoryActivateCodeRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository, activateCodeRepository, hashAdapter, securityAdapter, mailAdapter)

        const generateActivateCode = vitest.spyOn(GenerateActivateCode.prototype, 'execute')
        const date = new Date()
        date.setDate(date.getDate() - 1)
        generateActivateCode.mockImplementation(() => { return { code: '', expiresIn: date } });

        const user = await sutUser.execute({
            name: "Flaamer",
            email: "teste@teste.com",
            password: "teste123"
        })

        const sut = new ActivateUserUseCase(usersRepository, activateCodeRepository, mailAdapter)

        const code = sut.execute({
            userId: user.id,
            code: user.code.code
        })

        expect(code).rejects.toEqual(ErrCodeExpired)

    })

})