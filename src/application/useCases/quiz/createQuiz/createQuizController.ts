import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateQuizProps, CreateQuizUseCase } from "./createQuizUseCase";
import { AppError } from "../../../../shared/errors/AppError";

export class CreateQuizController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { title, questions, ownerId, createdAt }: CreateQuizProps = request.body

        try {
            const createQuizUseCase = container.resolve(CreateQuizUseCase)

            const quiz = await createQuizUseCase.execute({
                title,
                createdAt,
                ownerId,
                questions
            })

            return response.status(201).json(quiz); 
        } catch (error) {
            if(error instanceof AppError) {
                return response.status(500).json({ errors: [error] })
            }
            return response.status(500).json({ errors: "Unknow Error" })
        }
    }
};