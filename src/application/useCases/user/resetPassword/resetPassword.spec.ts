import 'reflect-metadata'
import { User, UserCode } from "@/domain/entities";
import { describe, expect, it, vitest } from "vitest";
import { ResetPasswordUseCase } from "./resetPasswordUseCase";
import { ErrInvalidParam, ErrNotFound } from "@/shared/errors";
import { InMemoryUserCodeRepository } from '@/tests/repositories';

describe('Reset Password', ()=>{
    it('should reset password', async () => {
        const userCodeRepository = new InMemoryUserCodeRepository()
        const sut = new ResetPasswordUseCase(userCodeRepository)

        vitest.spyOn(userCodeRepository, 'findByCode').mockReturnValue(new Promise((resolve)=>resolve(UserCode.create({
            active: true,
            code: 'VALID_CODE',
            createdAt: new Date(),
            expiresIn: new Date(new Date().setHours(new Date().getHours() + 3)),
            type: "FORGOT_PASSWORD",
            userId: 'fake_user_id'
        }))))

        const reset = await sut.execute({
            code: "VALID_CODE",
            password: "password",
            confirmPassword: "password"
        })

        expect(reset).toBeInstanceOf(User)
    })

    it('should throw an error if code is invalid', async () => {
        const userCodeRepository = new InMemoryUserCodeRepository()
        const sut = new ResetPasswordUseCase(userCodeRepository)

        const reset = sut.execute({
            code: "invalid_code",
            password: "password",
            confirmPassword: "password"
        })

        expect(reset).rejects.toBeInstanceOf(ErrNotFound)
    })
    it('should throw an error if code expired', async () => {})
    it('should throw an error if password and confirm password does not match', async () => {})
})