import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./authenticateUserUseCase";

export class AuthenticateUserController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body

        if (!email || !password) return response.status(422).json({ errors: "Invalid Data" })

        try {
            const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase)

            const user = await authenticateUserUseCase.execute({
                email,
                password
            })

            return response.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ errors: error.message })
            }
            return response.status(500).json({ errors: "Unknow Error" })
        }
    }
};