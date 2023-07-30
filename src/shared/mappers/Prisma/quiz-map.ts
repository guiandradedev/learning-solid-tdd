import { Quiz as prismaQuiz } from "@prisma/client"
import { Quiz } from "@/modules/quiz/domain"

const prismaQuizToEntity = (u: prismaQuiz): Quiz => {
    const user = Quiz.create({
        ownerId: u.ownerId,
        title: u.title,
        createdAt: u.createdAt
    }, u.id)

    return user
}

export { prismaQuizToEntity }