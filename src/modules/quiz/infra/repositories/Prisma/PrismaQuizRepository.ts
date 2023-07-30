import { IQuizRepository, QuizRequestRepository } from "@/modules/quiz/repositories";
import { Quiz } from "@/modules/quiz/domain";
import { prismaQuizToEntity } from "@/shared/mappers/Prisma/quiz-map";
import { prismaClient } from "@/shared/adapters/database/prisma";

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

    async list(request?: QuizRequestRepository | undefined): Promise<Quiz[]> {
        const quizzes = await prismaClient.quiz.findMany()

        if(!quizzes || quizzes.length == 0) return null

        return quizzes.map(prismaQuizToEntity)
    }

}