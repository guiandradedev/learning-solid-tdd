import { inject, injectable } from "tsyringe";
import { Submission } from "@/modules/quiz/domain";
import { ErrNotFound } from "@/shared/errors";
import { ISubmissionRepository } from "@/modules/quiz/repositories";

type GetSubmissionRequest = {
    submissionId: string
}
@injectable()
export class GetSubmissionUseCase {
    constructor(
        @inject('SubmissionRepository')
        private submissionsRepository: ISubmissionRepository
    ) { }

    async execute({submissionId}: GetSubmissionRequest): Promise<Submission> {
        const submission = await this.submissionsRepository.findById(submissionId)

        if(!submission) throw new ErrNotFound('submission')

        return submission;
    }
}