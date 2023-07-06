import { Quiz as prismaQuiz } from "@prisma/client"
import { Quiz } from "../../../domain/entities/quiz"

const prismaQuizToEntity = (u: prismaQuiz): Quiz => {
    const user = Quiz.create({
        ownerId: u.ownerId,
        title: u.title,
        createdAt: u.createdAt
    }, u.id)

    return user
}

export { prismaQuizToEntity }