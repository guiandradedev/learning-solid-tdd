import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./authenticateUserUseCase";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { userTokenResponse } from "@/shared/helpers/response";
import { AuthenticateUserRequest } from "@/modules/user/protocols";

export class AuthenticateUserController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { email, password }: AuthenticateUserRequest = request.body

        if (!email || !password) return response.status(422).json({ errors: [new ErrInvalidParam('data')] })

        try {
            const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase)

            const user = await authenticateUserUseCase.execute({
                email,
                password
            })

            return response.status(200).json({data: userTokenResponse(user)});
        } catch (error) {
            if(error instanceof AppError) {
                return response.status(error.status).json({ errors: [error] })
            }
            return response.status(500).json({ errors: [new ErrServerError()] })
        }
    }
};