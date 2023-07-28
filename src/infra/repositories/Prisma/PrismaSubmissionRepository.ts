import { ISubmissionRepository } from "../../../application/repositories/ISubmissionRepository";
import { Submission } from "../../../domain/entities/submission";
import { prismaSubmissionToEntity } from "../../../shared/mappers/Prisma/submission-map";
import { prismaClient } from "../../../shared/providers/database/prisma";
import { v4 as uuidv4 } from 'uuid'


export class PrismaSubmissionRepository implements ISubmissionRepository {
    async findById(id: string): Promise<Submission | null> {
        const submission = await prismaClient.submission.findUnique({ where: { id }, include: { SubmissionAnswers: true } })

        if (!submission) return null;

        const s = prismaSubmissionToEntity(submission)

        return s;
    }
    async create(data: Submission): Promise<void> {
        const submissionData = {
            id: data.id,
            userId: data.props.userId,
            quizId: data.props.quizId,
            grade: data.props.grade,
            createdAt: data.props.createdAt,
        }

        const answersData = []
        for (const [answer, index] of Object.entries(data.props.answers)) {
            const answerData = {
                id: uuidv4(),
                submissionId: data.id,
                answer,
                correct: Boolean(data.props.correctAnswers[index])
            }
            answersData.push(answerData)
        }
        await prismaClient.submission.create({ data: submissionData })
        await prismaClient.submissionAnswers.createMany({ data: answersData })
    }

    async findByUser(userId: string): Promise<Submission[] | null> {
        const submissions = await prismaClient.submission.findMany({ where: { userId }, include: { SubmissionAnswers: true } })

        if (!submissions || submissions.length == 0) return null;

        const s = submissions.map(prismaSubmissionToEntity)

        return s;
    }
}