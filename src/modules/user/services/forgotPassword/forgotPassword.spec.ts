import 'reflect-metadata'
import { UserCode } from '@/modules/user/domain';
import { InMemoryUserCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository } from '@/tests/repositories';
import { describe, expect, it } from "vitest";
import { ForgotPasswordUseCase } from './forgotPasswordUseCase';
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters';
import { ErrNotActive, ErrNotFound } from '@/shared/errors';
import { CreateUserUseCase } from '@/modules/user/services/createUser/createUserUseCase';

describe('Forgot Password', () => {
    const makeSut = async () => {
        const usersRepository = new InMemoryUsersRepository()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const mailAdapter = new InMemoryMailAdapter()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const userAdapter = new CreateUserUseCase(usersRepository, userTokenRepository, userCodeRepository, hashAdapter, securityAdapter, mailAdapter)
        const user = await userAdapter.execute({
            email: "flaamer@gmail.com",
            name: "Guilherme",
            password: "teste123",
            active: true
        })
        const sut = new ForgotPasswordUseCase(usersRepository, userCodeRepository, mailAdapter)

        return {
            usersRepository,
            userCodeRepository,
            mailAdapter,
            userTokenRepository,
            hashAdapter,
            securityAdapter,
            userAdapter,
            user,
            sut
        }
    }
    it('should forgot password', async () => {
        const { sut } = await makeSut()

        const code = await sut.execute({
            email: 'flaamer@gmail.com'
        })

        expect(code).toBeInstanceOf(UserCode)
    })

    it('should throw an error if user does not exists', async () => {
        const { sut } = await makeSut()

        const code = sut.execute({
            email: 'invalid_email@mail.com'
        })

        expect(code).rejects.toBeInstanceOf(ErrNotFound)
    })

    it('should throw an error if user is not active', async () => {
        const { userAdapter, sut } = await makeSut()
        await userAdapter.execute({
            email: "not_active_mail@gmail.com",
            name: "invalid_name",
            password: "invalid_password"
        })

        const code = sut.execute({
            email: 'not_active_mail@gmail.com'
        })

        expect(code).rejects.toBeInstanceOf(ErrNotActive)
    })
})