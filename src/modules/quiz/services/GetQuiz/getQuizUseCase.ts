import { inject, injectable } from "tsyringe";
import { IQuestionRepository, IQuizRepository } from "@/modules/quiz/repositories";
import { Quiz } from "@/modules/quiz/domain";
import { ErrNotFound } from "@/shared/errors";

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

        const newQuizInstance = Quiz.create({...quiz.props}, quiz.id)
        
        const response: Quiz = Object.assign(newQuizInstance, {questions})

        return response;
    }
}