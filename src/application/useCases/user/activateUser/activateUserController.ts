import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { ActivateUserRequest, ActivateUserUseCase } from "./activateUserUseCase";
import { userTokenResponse } from "@/shared/helpers/response";

export class ActivateUserController {

    async handle(request: Request, response: Response): Promise<Response> {
        const {code, userId}: ActivateUserRequest = request.body

        if (!code || !userId) return response.status(422).json({ errors: [new ErrInvalidParam('data')] })

        try {
            const activateUserUseCase = container.resolve(ActivateUserUseCase)

            const user = await activateUserUseCase.execute({
                code,
                userId
            })

            return response.status(200).json({data: user});
        } catch (error) {
            console.log(error)
            if(error instanceof AppError) {
                return response.status(error.status).json({ errors: [error] })
            }
            return response.status(500).json({ errors: [new ErrServerError()] })
        }
    }
};