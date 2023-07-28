import { IUserCodeRepository, IUsersRepository } from "../../repositories";
import { User } from "@/modules/user/domain";
import { IHashAdapter, IMailAdapter } from "@/modules/user/adapters";
import { ErrInvalidParam, ErrNotFound } from "@/shared/errors";
import { ErrExpired } from "@/shared/errors/ErrExpired";
import { SendUserMail } from "@/modules/user/helpers/mail/sendUserMail";
import { inject, injectable } from "tsyringe";
import { ResetPasswordRequest } from "@/modules/user/protocols";

@injectable()
export class ResetPasswordUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserCodeRepository')
        private userCodeRepository: IUserCodeRepository,

        @inject('MailAdapter')
        private mailAdapter: IMailAdapter,

        @inject('HashAdapter')
        private hashAdapter: IHashAdapter,
    ) { }

    async execute({ code, password, confirmPassword }: ResetPasswordRequest): Promise<User> {
        const codeExists = await this.userCodeRepository.findByCode({ code, type: 'FORGOT_PASSWORD' })
        if (!codeExists) throw new ErrInvalidParam('code')

        if (codeExists.props.expiresIn < new Date() || codeExists.props.active == false) {
            throw new ErrExpired('code')
        }

        if (password !== confirmPassword) throw new ErrInvalidParam('password and confirmPassword')

        const passwordHash = await this.hashAdapter.hash(password)
        password = passwordHash;

        const user = await this.usersRepository.changePassword({ userId: codeExists.props.userId, password })

        if (!user) throw new ErrNotFound('user')

        const sendUserMail = new SendUserMail(this.mailAdapter)
        await sendUserMail.passwordResetConfirmationMail({ to: user.props.email })

        return user
    }
}