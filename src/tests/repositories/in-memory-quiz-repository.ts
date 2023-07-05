import { IQuizRepository } from "../../application/repositories/IQuizRepository";
import { Quiz } from "../../domain/entities/quiz";

export class InMemoryQuizRepository implements IQuizRepository {
    public quizzes: Quiz[] = []

    async create(data: Quiz): Promise<void> {
        this.quizzes.push(data)
    }

    async findById(id: string): Promise<Quiz | null> {
        const quiz = this.quizzes.find((q)=>q.id == id)

        if(!quiz) return null;

        return quiz;
    }

}
