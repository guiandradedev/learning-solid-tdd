import { IQuizRepository, QuizRequestRepository } from "../../../../application/repositories/IQuizRepository";
import { Quiz } from "../../../../domain/entities/quiz";
import { prismaQuizToEntity } from "../../../../shared/mappers/Prisma/quiz-map";
import { prismaClient } from "../../../../shared/providers/prisma";


export class PrismaQuizRepository implements IQuizRepository {
    async findById(id: string): Promise<Quiz | null> {
        const quiz = await prismaClient.quiz.findUnique({
            where: {id},
        })

        if(!quiz) return null

        const q = prismaQuizToEntity(quiz)

        return q;
    }

    async create(data: Quiz): Promise<void> {
        await prismaClient.quiz.create({ data: {...data.props, id: data.id} })
    }

    async list(request?: QuizRequestRepository | undefined): Promise<Quiz[] | null> {
        return null
    }

}