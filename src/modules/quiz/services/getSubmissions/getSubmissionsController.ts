import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "@/shared/errors/AppError";
import { ErrServerError } from "@/shared/errors";
import { GetSubmissionsUseCase } from "./getSubmissionsUseCase";

export class GetSubmissionsController {

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const getSubmissionsUseCase = container.resolve(GetSubmissionsUseCase)

            const quiz = await getSubmissionsUseCase.execute()

            return response.status(201).json(quiz);
        } catch (error) {
            if (error instanceof AppError) {
                return response.status(error.status).json({ errors: [error] })
            }
            return response.status(500).json({ errors: [new ErrServerError()] })
        }
    }
};