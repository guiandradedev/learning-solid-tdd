import { QuestionProps, Quiz } from "../../../../domain/entities";
import { AppError } from "../../../../shared/errors";
import { IQuizRepository, IQuestionRepository } from "../../../repositories/";

interface ReturnQuiz extends Quiz{
    questions: QuestionProps[]
}

export class GetQuizzesUseCase {
    constructor(
        private quizRepository: IQuizRepository,
        private questionsRepository: IQuestionRepository
    ) { }

    async execute(): Promise<ReturnQuiz[]> {
        const quizzes = await this.quizRepository.list()

        if (!quizzes) throw new AppError({ title: "ERR_QUIZ_NOT_FOUND", message: "Quiz not found", status: 500 })

        const qzs: ReturnQuiz[] = [];;

        for(const q of quizzes) {
            const questions: QuestionProps[] = []
            const a: ReturnQuiz = Object.assign(q, {
                questions
            })
            qzs.push(a)
        }

        return qzs
    }
}