import { ISubmissionRepository, SubmissionRequestRepository } from "../../application/repositories/ISubmissionRepository";
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

    async findByUser(userId: string): Promise<Submission[] | null> {
        const submissions = this.submissions.filter((q)=>q.props.userId == userId)

        if(submissions.length == 0) return null

        return submissions;
    }

    async list(request?: SubmissionRequestRepository): Promise<Submission[]> {
        if(this.submissions.length == 0) return null;
        return this.submissions
    }
}