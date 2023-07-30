import 'reflect-metadata'

import { describe, expect, it, vitest } from "vitest";
import { CreateUserUseCase } from "@/modules/user/services/createUser/createUserUseCase";
import { InMemoryUserCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository } from "@/tests/repositories";
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from "@/tests/adapters";
import { UserCode, User } from '@/modules/user/domain';
import { ActivateUserUseCase } from './activateUserUseCase';
import { ErrAlreadyActive, ErrInvalidParam, ErrNotFound } from '@/shared/errors';
import { GenerateUserCode } from '@/modules/user/utils/GenerateUserCode';
import { ErrExpired } from '@/shared/errors/ErrExpired';

describe("ActivateUserCode", () => {
    const makeSut = async () => {
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

        const code = await userCodeRepository.findByUserId({userId: user.id, type: 'ACTIVATE_ACCOUNT'})

        const sut = new ActivateUserUseCase(usersRepository, userCodeRepository, mailAdapter)

        return { sut, usersRepository, user, code, sutUser, userCodeRepository }
    }
    it('should activate an user if code is valid', async () => {
        const { sut, user, code, usersRepository } = await makeSut();

        const activateUser = await sut.execute({
            userId: user.id,
            code: code.props.code
        })

        expect(activateUser).toBeInstanceOf(UserCode)
        
        const validateUser = await usersRepository.findById(activateUser.props.userId)
        expect(validateUser.props.active).toBe(true)
    })

    it('should throw an error if user does not exists', async () => {
        const { sut, code } = await makeSut();

        const activateCode = sut.execute({
            userId: 'fake_user_id',
            code: code.props.code
        })

        expect(activateCode).rejects.toBeInstanceOf(ErrNotFound)
    })

    it('should throw an error if user code not exists', async () => {
        const { sut, user, code } = await makeSut();

        const activateCode = sut.execute({
            userId: user.id,
            code: "fake_code"
        })

        expect(activateCode).rejects.toBeInstanceOf(ErrInvalidParam)
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
        date.setDate(date.getDate() - 3)
        generateActivateCode.mockImplementationOnce(() => { return { code: '', expiresIn: date } });

        const user = await sutUser.execute({
            name: "Flaamer",
            email: "teste@teste.com",
            password: "teste123"
        })
        const code = await userCodeRepository.findByUserId({userId: user.id, type: 'ACTIVATE_ACCOUNT'})

        const sut = new ActivateUserUseCase(usersRepository, userCodeRepository, mailAdapter)

        const activateCode = sut.execute({
            userId: user.id,
            code: code.props.code
        })

        expect(activateCode).rejects.toBeInstanceOf(ErrExpired)

    })

    it('should throw an error if user already active', async () => {
        const { sut, sutUser, userCodeRepository } = await makeSut();
        const user = await sutUser.execute({
            name: "Flaamer",
            email: "teste1@teste.com",
            password: "teste123",
            active: true
        })

        const activateUser = sut.execute({
            userId: user.id,
            code: 'fake_code'
        })

        expect(activateUser).rejects.toBeInstanceOf(ErrAlreadyActive)

    })

})