import { Question } from "../../domain/entities";

export interface IQuestionRepository {
    create(question: Question): Promise<void>
    findByQuizId(quizId: string): Promise<Question[] | null>
}