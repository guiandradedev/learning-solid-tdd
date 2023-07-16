import { inject, injectable } from "tsyringe";
import { IQuestionRepository, IQuizRepository } from "../../../repositories";
import { Quiz } from "../../../../domain/entities";
import { AppError } from "../../../../shared/errors";

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

        const questions = await this.questionsRepository.findByQuizId(quizId)

        const response = Object.assign(quiz, questions)

        return response;
    }
}