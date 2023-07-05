import { ISubmissionRepository } from "../../repositories/ISubmissionRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";

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
        if(!userExists) throw new Error("User not found")

        const submissions = await this.submissionsRepository.findByUser(userId)

        if(!submissions) throw new Error("Submissions not found")

        return submissions
    }
}