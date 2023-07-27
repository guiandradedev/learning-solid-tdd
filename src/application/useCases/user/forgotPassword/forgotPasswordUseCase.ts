import { IUserCodeRepository, IUsersRepository } from "@/application/repositories";
import { User, UserCode } from "@/domain/entities";
import { ErrNotFound } from "@/shared/errors";
import { inject, injectable } from "tsyringe";

type ResetPasswordRequest = {
    email: string
}

@injectable()
export class ForgotPasswordUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('userCodeRepository')
        private userCodeRepository: IUserCodeRepository,
    ){}

    async execute({email}: ResetPasswordRequest): Promise<UserCode> {
        return UserCode.create({
            active: true,
            code: 'valid_code',
            createdAt: new Date(),
            expiresIn: new Date(),
            type: "FORGOT_PASSWORD",
            userId: "valid_user_id"
        })
    }
}