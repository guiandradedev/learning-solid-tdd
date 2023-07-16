import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserUseCase } from "./createUserUseCase";
import { AppError, ErrInternalServerError, ErrInvalidData } from "shared/errors";

export class CreateUserController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body

        if (!name || !email || !password) return response.status(422).json({erros: [ErrInvalidData]})

        try {
            const createUserUseCase = container.resolve(CreateUserUseCase)

            const user = await createUserUseCase.execute({
                name,
                email,
                password
            })

            return response.status(201).json({data: user});
        } catch (error) {
            if(error instanceof AppError) {
                return response.status(500).json({ errors: [error] })
            }
            return response.status(500).json({erros: [ErrInternalServerError]})
        }
    }
};