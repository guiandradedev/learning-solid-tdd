import { IQuizRepository, QuizRequestRepository } from "@/modules/quiz/repositories/IQuizRepository";
import { Quiz } from "@/modules/quiz/domain";

export class InMemoryQuizRepository implements IQuizRepository {
    public quizzes: Quiz[] = []

    async create(data: Quiz): Promise<void> {
        this.quizzes.push(data)
    }

    async findById(id: string): Promise<Quiz | null> {
        const quiz = this.quizzes.find((q)=>q.id == id)

        if(!quiz) return null;

        return Quiz.create({...quiz.props}, quiz.id);
    }

    async list(request?: QuizRequestRepository): Promise<Quiz[] | null> {
        if(this.quizzes.length == 0) return null;
        return this.quizzes
    }

}
