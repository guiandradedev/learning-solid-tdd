import { prismaQuestionToEntity } from "../../../shared/mappers/Prisma/question-map";
import { IQuestionRepository } from "../../../application/repositories/IQuestionRepository";
import { Question } from "../../../domain/entities/question";
import { prismaClient } from "../../../shared/providers/database/prisma";
import { v4 as uuidv4 } from 'uuid'
export class PrismaQuestionRepository implements IQuestionRepository {
    async create(data: Question): Promise<void> {
        await prismaClient.question.create({
            data: {
                id: data.id,
                question: data.props.question,
                answers: {
                    createMany: {
                        data: data.props.answers.map((answer, index) => {
                            return {
                                id: uuidv4(),
                                answer,
                                position: index
                            }
                        })
                    }
                },
                correctAnswer: data.props.correctAnswer,
                quizId: data.props.quizId
            }
        })
    }
    async findByQuizId(quizId: string): Promise<Question[] | null> {
        const quiz = await prismaClient.question.findMany({
            where: {quizId},
            include: {answers: {
                orderBy: {
                    position: 'asc'
                }
            }}
        })
        return quiz.map(prismaQuestionToEntity)
    }

}