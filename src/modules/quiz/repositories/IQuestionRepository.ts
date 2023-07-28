import { Question } from "@/modules/quiz/domain";

export interface IQuestionRepository {
    create(question: Question): Promise<void>
    findByQuizId(quizId: string): Promise<Question[] | null>
}