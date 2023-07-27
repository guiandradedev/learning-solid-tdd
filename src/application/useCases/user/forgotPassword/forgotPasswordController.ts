import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { userTokenResponse } from "@/shared/helpers/response";
import { ForgotPasswordRequest, ForgotPasswordUseCase } from "./forgotPasswordUseCase";

export class ForgotPasswordController {

    async handle(request: Request, response: Response): Promise<Response> {
        const {email}: ForgotPasswordRequest = request.body

        if (!email) return response.status(422).json({ errors: [new ErrInvalidParam('email')] })

        try {
            const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase)

            const user = await forgotPasswordUseCase.execute({
                email
            })

            return response.status(200).json({data: 'Code sent in your email'});
        } catch (error) {
            console.log(error)
            if(error instanceof AppError) {
                return response.status(error.status).json({ errors: [error] })
            }
            return response.status(500).json({ errors: [new ErrServerError()] })
        }
    }
};