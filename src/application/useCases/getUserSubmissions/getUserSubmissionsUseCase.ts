import { AppError } from "../../../shared/errors";
import { ISubmissionRepository, IUsersRepository } from "../../repositories";

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
        if(!userExists) throw new AppError({title: "ERR_USER_NOT_FOUND", message: "User not found", status: 500})

        const submissions = await this.submissionsRepository.findByUser(userId)

        if(!submissions) throw new AppError({title: "ERR_SUBMISSION_NOT_FOUND", message: "Submission not found", status: 500})

        return submissions
    }
}