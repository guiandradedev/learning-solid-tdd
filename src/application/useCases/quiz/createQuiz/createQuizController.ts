import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateQuizProps, CreateQuizUseCase } from "./createQuizUseCase";
import { AppError } from "../../../../shared/errors/AppError";
import { ErrInvalidParam, ErrServerError } from "@/shared/errors";

export class CreateQuizController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { title, questions, ownerId }: CreateQuizProps = request.body

        if (!title || !questions || !ownerId) return response.status(422).json({erros: [new ErrInvalidParam('data')]})

        try {
            const createQuizUseCase = container.resolve(CreateQuizUseCase)

            const quiz = await createQuizUseCase.execute({
                title,
                ownerId,
                questions
            })

            return response.status(201).json(quiz); 
        } catch (error) {
            console.log(error)
            if(error instanceof AppError) {
                return response.status(error.status).json({ errors: [error] })
            }
            return response.status(500).json({ errors: [new ErrServerError()] })
        }
    }
};