import { Quiz } from "../../../domain/entities/quiz";
import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { IQuizRepository } from "../../repositories/IQuizRepository";

export class GetQuizzesUseCase {
    constructor(
        private quizRepository: IQuizRepository,
        private questionsRepository: IQuestionRepository
    ) {}

    async execute(): Promise<Quiz[]> {
        const quizzes = await this.quizRepository.list()
        
        if(!quizzes) throw new Error("Quiz not found")

        return quizzes
    }
}