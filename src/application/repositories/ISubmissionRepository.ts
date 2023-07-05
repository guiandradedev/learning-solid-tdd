import { Submission } from "../../domain/entities/submission";

export interface ISubmissionRepository {
    findById(id: string): Promise<Submission | null>
    create(submission: Submission): Promise<void>
    findByUser(userId: string): Promise<Submission[] | null>
}