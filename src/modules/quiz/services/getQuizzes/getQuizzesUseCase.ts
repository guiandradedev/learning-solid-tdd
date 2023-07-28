import { inject, injectable } from "tsyringe";
import { Question, Quiz } from "@/modules/quiz/domain";
import { AppError } from "@/shared/errors";
import { IQuizRepository, IQuestionRepository } from "@/modules/quiz/repositories";

interface ReturnQuiz extends Quiz{
    questions: Question[]
}

@injectable()
export class GetQuizzesUseCase {
    constructor(
        @inject('QuizRepository')
        private quizRepository: IQuizRepository,
        @inject('QuestionRepository')
        private questionsRepository: IQuestionRepository
    ) { }

    async execute(): Promise<ReturnQuiz[]> {
        const quizzes = await this.quizRepository.list()

        if (!quizzes) throw new AppError({ title: "ERR_QUIZ_NOT_FOUND", message: "Quiz not found", status: 500 })

        const qzs: ReturnQuiz[] = [];
        
        for(const q of quizzes) {
            const questions = await this.questionsRepository.findByQuizId(q.id)
            const data: ReturnQuiz = Object.assign(q, {
                questions
            })
            qzs.push(data)
        }

        return qzs
    }
}