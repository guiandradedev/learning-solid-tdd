import { AppError, ErrNotFound } from "../../../../shared/errors";
import { ISubmissionRepository, IUsersRepository } from "../../../repositories";

type GetUserRequest = {
    userId: string
}

export class GetUserSubmissionsUseCase {
    constructor(
        private submissionsRepository: ISubmissionRepository,
        private usersRepository: IUsersRepository
    ) {}

    async execute({userId}: GetUserRequest) {
        const userExists = await this.usersRepository.findById(userId)
        if(!userExists) throw new ErrNotFound('user')

        const submissions = await this.submissionsRepository.findByUser(userId)

        if(!submissions) throw new ErrNotFound('submission')

        return submissions
    }
}