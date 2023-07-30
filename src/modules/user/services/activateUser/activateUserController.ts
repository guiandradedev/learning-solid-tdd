import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { ActivateUserUseCase } from "./activateUserUseCase";
import { ActivateUserRequest } from "@/modules/user/protocols";

export class ActivateUserController {

    async handle(request: Request, response: Response): Promise<Response> {
        const {code, userId}: ActivateUserRequest = request.body

        if (!code || !userId) return response.status(422).json({ errors: [new ErrInvalidParam('data')] })

        try {
            const activateUserUseCase = container.resolve(ActivateUserUseCase)

            await activateUserUseCase.execute({
                code,
                userId
            })

            return response.status(200).json({data: 'Account activated!'});
        } catch (error) {
            if(error instanceof AppError) {
                return response.status(error.status).json({ errors: [error] })
            }
            return response.status(500).json({ errors: [new ErrServerError()] })
        }
    }
};