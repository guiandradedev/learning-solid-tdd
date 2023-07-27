import 'reflect-metadata'
import { User, UserCode } from "@/domain/entities";
import { describe, expect, it, vitest } from "vitest";
import { ResetPasswordUseCase } from "./resetPasswordUseCase";
import { ErrInvalidParam } from "@/shared/errors";
import { InMemoryUserCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository } from '@/tests/repositories';
import { ForgotPasswordUseCase } from '../forgotPassword/forgotPasswordUseCase';
import { CreateUserUseCase } from '../createUser/createUserUseCase';
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters';
import { GenerateUserCode } from '@/application/services/GenerateUserCode';
import { ErrExpired } from '@/shared/errors/ErrExpired';

describe('Reset Password', () => {
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
        const forgotPasswordAdapter = new ForgotPasswordUseCase(usersRepository, userCodeRepository, mailAdapter)
        const code = await forgotPasswordAdapter.execute({
            email: user.props.email
        })

        const sut = new ResetPasswordUseCase(usersRepository, userCodeRepository, mailAdapter, hashAdapter)

        return {
            usersRepository,
            userCodeRepository,
            mailAdapter,
            userTokenRepository,
            hashAdapter,
            securityAdapter,
            userAdapter,
            user,
            forgotPasswordAdapter,
            sut,
            code
        }
    }
    it('should reset password', async () => {
        const { sut, code, user, hashAdapter } = await makeSut()

        let oldPassword = user.props.password
        const password = "password"

        const reset = await sut.execute({
            code: code.props.code,
            password,
            confirmPassword: password
        })

        console.log(reset)

        expect(reset).toBeInstanceOf(User)
        expect(user.props.password).toBe(await hashAdapter.hash(password))
        // expect(user.props.password).not.toBe(oldPassword)
    })

    it('should throw an error if code is invalid', async () => {
        const { sut } = await makeSut()

        const reset = sut.execute({
            code: "invalid_code",
            password: "password",
            confirmPassword: "password"
        })

        expect(reset).rejects.toBeInstanceOf(ErrInvalidParam)
    })
    it('should throw an error if code expired', async () => {
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
        const forgotPasswordAdapter = new ForgotPasswordUseCase(usersRepository, userCodeRepository, mailAdapter)

        const generateActivateCode = vitest.spyOn(GenerateUserCode.prototype, 'execute')
        const date = new Date()
        date.setDate(date.getDate() - 1)
        generateActivateCode.mockImplementationOnce(() => { return { code: '', expiresIn: date } });
        
        const code = await forgotPasswordAdapter.execute({
            email: user.props.email
        })

        const sut = new ResetPasswordUseCase(usersRepository, userCodeRepository, mailAdapter, hashAdapter)

        const password = "password"

        const reset = sut.execute({
            code: code.props.code,
            password,
            confirmPassword: password
        })

        expect(reset).rejects.toBeInstanceOf(ErrExpired)
    })


    it('should throw an error if password and confirm password does not match', async () => {
        const { sut, code } = await makeSut()

        const reset = sut.execute({
            code: code.props.code,
            password: 'valid_password',
            confirmPassword: 'invalid_password'
        })

        expect(reset).rejects.toBeInstanceOf(ErrInvalidParam)
    })
})