import { ISubmissionRepository } from "../../application/repositories/ISubmissionRepository";
import { Submission } from "../../domain/entities/submission";

export class InMemorySubmissionsRepository implements ISubmissionRepository {
    private submissions: Submission[] = []
    
    async findById(id: string): Promise<Submission | null> {
        const submission = this.submissions.find((s)=>s.id == id)

        if(!submission) return null;

        return submission;
    }
    async create(submission: Submission): Promise<void> {
        this.submissions.push(submission)
    }
}