import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { CreateSubmissionRequest, CreateSubmissionUseCase } from "./createSubmissionUseCase";

export class CreateSubmissionController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { quizId, answers }: CreateSubmissionRequest = request.body

        if (!quizId || !answers) return response.status(422).json({ erros: [new ErrInvalidParam('data')] })

        const userId = request.user.id

        try {
            const createSubmissionUseCase = container.resolve(CreateSubmissionUseCase)

            const submission = await createSubmissionUseCase.execute({
                userId, quizId, answers
            })

            return response.status(201).json(submission);
        } catch (error) {
            if (error instanceof AppError) {
                return response.status(error.status).json({ errors: [error] })
            }
            return response.status(500).json({ errors: [new ErrServerError()] })
        }
    }
};