import { IQuestionRepository } from "../../../application/repositories/IQuestionRepository";
import { Question } from "../../../domain/entities/question";
import { prismaClient } from "../../../shared/providers/prisma";
export class PrismaQuestionRepository implements IQuestionRepository {
    async create(data: Question): Promise<void> {
        await prismaClient.question.create({ data: {...data.props, id: data.id} })
    }
    async findByQuizId(quizId: string): Promise<Question[] | null> {
        return null
    }

}