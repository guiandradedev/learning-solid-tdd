import { UserCode } from '@/domain/entities';
import { InMemoryUserCodeRepository, InMemoryUsersRepository } from '@/tests/repositories';
import 'reflect-metadata'
import { describe, expect, it } from "vitest";
import { ForgotPasswordUseCase } from './forgotPasswordUseCase';

describe('Forgot Password', ()=>{
    it('should forgot password', async ()=>{
        const usersRepository = new InMemoryUsersRepository()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const sut = new ForgotPasswordUseCase(usersRepository, userCodeRepository)

        const code = await sut.execute({
            email: 'valid_email@mail.com'
        })

        expect(code).toBeInstanceOf(UserCode)
    })
})