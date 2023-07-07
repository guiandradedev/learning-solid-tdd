import { Prisma } from "@prisma/client"
import { Submission } from "../../../domain/entities/submission"

export type PrismaSubmissionWithAnswers = Prisma.SubmissionGetPayload<{
    include: {SubmissionAnswers: true}
  }>

const prismaSubmissionToEntity = (u: PrismaSubmissionWithAnswers): Submission => {
    const submission = Submission.create({
        userId: u.id,
        quizId: u.quizId,
        grade: u.grade,
        answers: u.SubmissionAnswers.map((answer)=>{
            return answer.answer
        }),
        correctAnswers: u.SubmissionAnswers.map((answer)=>{
            return answer.correct
        }),
        createdAt: u.createdAt
    }, u.id)

    return submission
}

export { prismaSubmissionToEntity }