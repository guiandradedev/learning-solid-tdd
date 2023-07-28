import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { GetSubmissionUseCase } from "./getSubmissionUseCase";

export class GetSubmissionController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { search } = request.params

        if(!search) return response.status(422).json({erros: [new ErrInvalidParam('search')]})

        try {
            const getSubmissionUseCase = container.resolve(GetSubmissionUseCase)

            const quiz = await getSubmissionUseCase.execute({submissionId: search})

            return response.status(201).json(quiz);
        } catch (error) {
            console.log(error)
            if (error instanceof AppError) {
                return response.status(error.status).json({ errors: [error] })
            }
            return response.status(500).json({ errors: [new ErrServerError()] })
        }
    }
};