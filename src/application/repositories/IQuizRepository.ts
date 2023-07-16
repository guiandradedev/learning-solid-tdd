import { Quiz } from "../../domain/entities";

export type QuizRequestRepository = {
    include: {
        questions: boolean
    }
}

export interface IQuizRepository {
    create(quiz: Quiz): Promise<void>
    findById(id: string): Promise<Quiz | null>
    list(request?: QuizRequestRepository): Promise<Quiz[] | null>
}