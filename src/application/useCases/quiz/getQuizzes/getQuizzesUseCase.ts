import { Quiz } from "../../../../domain/entities";
import { AppError } from "../../../../shared/errors";
import { IQuizRepository, IQuestionRepository } from "../../../repositories/";

export class GetQuizzesUseCase {
    constructor(
        private quizRepository: IQuizRepository,
        private questionsRepository: IQuestionRepository
    ) {}

    async execute(): Promise<Quiz[]> {
        const quizzes = await this.quizRepository.list()
        
        if(!quizzes) throw new AppError({title: "ERR_QUIZ_NOT_FOUND", message: "Quiz not found", status: 500})

        return quizzes
    }
}