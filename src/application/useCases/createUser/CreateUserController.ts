import { Request, Response } from "express";
import { User } from "../../../domain/entities/user";
import { container } from "tsyringe";
import { CreateUserUseCase } from "./createUserUseCase";

export class CreateUserController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body

        if (!name || !email) return response.status(422).json({ errors: "Invalid Data" })

        try {
            const createUserUseCase = container.resolve(CreateUserUseCase)

            const user = await createUserUseCase.execute({
                name,
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