import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { ResetPasswordUseCase } from "./resetPasswordUseCase";
import { ResetPasswordRequest } from "@/modules/user//protocols";

export class ResetPasswordController {

    async handle(request: Request, response: Response): Promise<Response> {
        const {code, confirmPassword, password}: ResetPasswordRequest = request.body

        if (!code || !confirmPassword || !password) return response.status(422).json({ errors: [new ErrInvalidParam('data')] })

        if (password !== confirmPassword) return response.status    (422).json({ errors: [new ErrInvalidParam('password and confirmPassword')] })

        try {
            const resetPasswordUseCase = container.resolve(ResetPasswordUseCase)

            const user = await resetPasswordUseCase.execute({
                code,
                password,
                confirmPassword
            })

            return response.status(200).json({data: 'Password successful changed!'});
        } catch (error) {
            if(error instanceof AppError) {
                return response.status(error.status).json({ errors: [error] })
            }
            return response.status(500).json({ errors: [new ErrServerError()] })
        }
    }
};