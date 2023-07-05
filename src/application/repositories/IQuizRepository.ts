import { Quiz } from "../../domain/entities/quiz";

export interface IQuizRepository {
    create(quiz: Quiz): Promise<void>
    findById(id: string): Promise<Quiz | null>
}