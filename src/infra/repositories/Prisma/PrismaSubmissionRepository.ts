import { ISubmissionRepository } from "../../../application/repositories/ISubmissionRepository";
import { Submission } from "../../../domain/entities/submission";
import { prismaSubmissionToEntity } from "../../../shared/mappers/Prisma/submission-map";
import { prismaClient } from "../../../shared/providers/database/prisma";


export class PrismaSubmissionRepository implements ISubmissionRepository {
    async findById(id: string): Promise<Submission | null> {
        const submission = await prismaClient.submission.findUnique({where: {id}, include: {SubmissionAnswers: true}})

        if (!submission) return null;

        const s = prismaSubmissionToEntity(submission)

        return s;
    }
    async create(data: Submission): Promise<void> {
        await prismaClient.submission.create({ data: { ...data.props, id: data.id } })
    }

    async findByUser(userId: string): Promise<Submission[] | null> {
        const submissions = await prismaClient.submission.findMany({where: {userId}, include: {SubmissionAnswers: true}})

        if (!submissions || submissions.length == 0) return null;

        const s = submissions.map(prismaSubmissionToEntity)

        return s;
    }
}