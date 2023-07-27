import { IUserCodeRepository, IUsersRepository } from "@/application/repositories";
import { GenerateUserCode, TypeCode } from "@/application/services/GenerateUserCode";
import { UserCode } from "@/domain/entities";
import { MailAdapter } from "@/shared/adapters";
import { ErrNotActive, ErrNotFound } from "@/shared/errors";
import { SendUserMail } from "@/shared/helpers/mail/SendUserMail";
import { inject, injectable } from "tsyringe";

export type ForgotPasswordRequest = {
    email: string
}

@injectable()
export class ForgotPasswordUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserCodeRepository')
        private userCodeRepository: IUserCodeRepository,

        @inject('MailAdapter')
        private mailAdapter: MailAdapter
    ) { }

    async execute({ email }: ForgotPasswordRequest): Promise<UserCode> {
        const userExists = await this.usersRepository.findByEmail(email)
        if (!userExists) throw new ErrNotFound('user')
        
        if (!userExists.props.active) {
            //resend activate email here?
            throw new ErrNotActive('user')
        }
        
        const generateUserCode = new GenerateUserCode()
        const { code, expiresIn } = generateUserCode.execute({ type: TypeCode.string, size: 6 })

        const userCode = UserCode.create({
            active: true,
            code,
            expiresIn,
            createdAt: new Date(),
            userId: userExists.id,
            type: "FORGOT_PASSWORD"
        })
        await this.userCodeRepository.create(userCode)

        const sendUserMail = new SendUserMail(this.mailAdapter)
        await sendUserMail.resetPasswordMail({ to: email, code })

        return userCode
    }
}