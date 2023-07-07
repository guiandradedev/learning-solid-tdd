import { inject, injectable } from "tsyringe";
import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { IQuizRepository } from "../../repositories/IQuizRepository";
import { Quiz } from "../../../domain/entities/quiz";
import { AppError } from "../../../shared/errors/AppError";

type GetQuizRequest = {
    quizId: string
}
@injectable()
export class GetQuizUseCase {
    constructor(
        @inject('QuizRepository')
        private quizRepository: IQuizRepository,
        @inject('QuestionRepository')
        private questionsRepository: IQuestionRepository
    ) { }

    async execute({quizId}: GetQuizRequest): Promise<Quiz> {
        const quiz = await this.quizRepository.findById(quizId)

        if(!quiz) throw new AppError({title: "ERR_QUIZ_NOT_FOUND", message: "Quiz not found", status: 500})

        return quiz;
    }
}