import { IUserCodeRepository, IUsersRepository } from "@/application/repositories";
import { User } from "@/domain/entities";
import { MailAdapter } from "@/shared/adapters";
import { ErrInvalidParam, ErrNotFound } from "@/shared/errors";
import { ErrExpired } from "@/shared/errors/ErrExpired";
import { inject, injectable } from "tsyringe";

type ResetPasswordRequest = {
    code: string,
    password: string,
    confirmPassword: string
}

@injectable()
export class ResetPasswordUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('userCodeRepository')
        private userCodeRepository: IUserCodeRepository,

        @inject('MailAdapter')
        private mailAdapter: MailAdapter
    ) { }

    async execute({ code, password, confirmPassword }: ResetPasswordRequest): Promise<User> {
        const codeExists = await this.userCodeRepository.findByCode({ code, type: 'FORGOT_PASSWORD' })
        if (!codeExists) throw new ErrInvalidParam('code')

        if (codeExists.props.expiresIn < new Date() || codeExists.props.active == false) {
            throw new ErrExpired('code')
        }

        if (password !== confirmPassword) throw new ErrInvalidParam('password and confirmPassword')

        const user = await this.usersRepository.changePassword({ userId: codeExists.props.userId, password })

        if (!user) throw new ErrNotFound('user')

        return user
    }
}