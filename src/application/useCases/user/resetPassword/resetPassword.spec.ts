import { User } from "@/domain/entities";
import { describe, expect, it } from "vitest";
import { ResetPasswordUseCase } from "./resetPasswordUseCase";
import { ErrInvalidParam } from "@/shared/errors";

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

    it('should throw an error if code is invalid', async () => {
        // const sut = new ResetPasswordUseCase()

        // const reset = sut.execute({
        //     code: "invalid_code",
        //     password: "password",
        //     confirmPassword: "password"
        // })

        // expect(reset).rejects.toBeInstanceOf(ErrInvalidParam)
    })
    it('should throw an error if code expired', async () => {})
    it('should throw an error if password and confirm password does not match', async () => {})
})