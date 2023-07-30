import { Prisma, Question as prismaQuestion } from "@prisma/client"
import { Question } from "@/modules/quiz/domain"

export type PrismaQuestionWithAnswers = Prisma.QuestionGetPayload<{
    include: {answers: true}
  }>

const prismaQuestionToEntity = (u: PrismaQuestionWithAnswers): Question => {
    const question = Question.create({
        question: u.question,
        correctAnswer: u.correctAnswer,
        quizId: u.quizId,
        answers: u.answers.map((answer)=>{
            return answer.answer
        })
    }, u.id)

    return question
}

export { prismaQuestionToEntity }