import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "@/shared/errors/AppError";
import { ErrServerError } from "@/shared/errors";
import { GetQuizzesUseCase } from "./getQuizzesUseCase";

export class GetQuizzesController {

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const getQuizzesUseCase = container.resolve(GetQuizzesUseCase)

            const quiz = await getQuizzesUseCase.execute()

            return response.status(201).json(quiz);
        } catch (error) {
            if (error instanceof AppError) {
                return response.status(error.status).json({ errors: [error] })
            }
            return response.status(500).json({ errors: [new ErrServerError()] })
        }
    }
};