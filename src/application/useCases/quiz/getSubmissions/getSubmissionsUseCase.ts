import { inject, injectable } from "tsyringe";
import { ErrNotFound } from "../../../../shared/errors";
import { ISubmissionRepository } from "../../../repositories";

@injectable()
export class GetSubmissionsUseCase {
    constructor(
        @inject('SubmissionRepository')
        private submissionsRepository: ISubmissionRepository
    ) {}

    async execute() {
        const submissions = await this.submissionsRepository.list()

        if(!submissions) throw new ErrNotFound('submission')

        return submissions
    }
}