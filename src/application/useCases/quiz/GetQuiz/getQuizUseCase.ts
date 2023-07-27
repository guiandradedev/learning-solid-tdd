import { inject, injectable } from "tsyringe";
import { IQuestionRepository, IQuizRepository } from "../../../repositories";
import { Quiz } from "../../../../domain/entities";
import { AppError, ErrNotFound } from "../../../../shared/errors";

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

        if(!quiz) throw new ErrNotFound('quiz')

        const questions = await this.questionsRepository.findByQuizId(quizId)

        if(!questions) throw new ErrNotFound('questions')

        const response = Object.assign(quiz, questions)

        return response;
    }
}