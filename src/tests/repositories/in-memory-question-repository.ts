import { IQuestionRepository } from "../../application/repositories/IQuestionRepository";
import { Question } from "@/modules/quiz/domain";

export class InMemoryQuestionsRepository implements IQuestionRepository {
    public questions: Question[] = []

    async create(data: Question): Promise<void> {
        this.questions.push(data)
    }

    async findByQuizId(quizId: string): Promise<Question[] | null> {
        const question = this.questions.filter((q)=>q.props.quizId == quizId)

        if(!question) return null

        return question;
    }
}
