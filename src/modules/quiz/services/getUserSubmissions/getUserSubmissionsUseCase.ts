import { inject, injectable } from "tsyringe";
import { ErrNotFound } from "@/shared/errors";
import { IUsersRepository } from "@/modules/user/repositories";
import { ISubmissionRepository } from "@/modules/quiz/repositories";

type GetUserRequest = {
    userId: string
}

@injectable()
export class GetUserSubmissionsUseCase {
    constructor(
        @inject('SubmissionRepository')
        private submissionsRepository: ISubmissionRepository,
        @inject('UsersRepository')
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