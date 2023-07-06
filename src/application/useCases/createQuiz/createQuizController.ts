import { Request, Response } from "express";
import { container } from "tsyringe";

export class CreateQuizController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { title, questions, ownerId, createdAt } = request.body

        if (!title || !ownerId || !createdAt || !questions || questions.length == 0) return response.status(422).json({ errors: "Invalid Data" })

        try {
            return response.status(201)
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ errors: error.message })
            }
            return response.status(500).json({ errors: "Unknow Error" })
        }
    }
};