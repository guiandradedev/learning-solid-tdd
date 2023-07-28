import { Submission } from "../../domain/entities";

export type SubmissionRequestRepository = {
    include: {
        
    }
}

export interface ISubmissionRepository {
    findById(id: string): Promise<Submission | null>
    create(submission: Submission): Promise<void>
    findByUser(userId: string): Promise<Submission[] | null>
    // findByQuiz(quizId: string): Promise<Submission[] | null>
    list(request?: SubmissionRequestRepository): Promise<Submission[] | null>
}