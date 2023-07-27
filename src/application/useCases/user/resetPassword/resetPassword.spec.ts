import { User } from "@/domain/entities";
import { describe, expect, it } from "vitest";
import { ResetPasswordUseCase } from "./resetPasswordUseCase";

describe('Reset Password', ()=>{
    it('should reset password', async () => {
        const sut = new ResetPasswordUseCase()

        const reset = await sut.execute({
            code: "VALID_CODE",
            password: "password",
            confirmPassword: "password"
        })

        expect(reset).toBeInstanceOf(User)
    })

    it('should throw an error if user does not exists', () => {})
    it('should throw an error if code is invalid', () => {})
    it('should throw an error if code expired', () => {})
})