import { IQuizRepository, QuizRequestRepository } from "../../application/repositories/IQuizRepository";
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

    async list(request?: QuizRequestRepository): Promise<Quiz[] | null> {
        if(this.quizzes.length == 0) return null;

        // if(request) {
        //     const options = Object.entries(request.include)
            
        //     for(const [index, option] of options.entries()) {
        //         console.log(index)
        //     }
        // }

        return this.quizzes
    }

}
