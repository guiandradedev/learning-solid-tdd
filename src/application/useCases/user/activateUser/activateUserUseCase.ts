import { inject, injectable } from "tsyringe";
import { IUserCodeRepository, IUsersRepository } from "../../../repositories";
import { ErrAlreadyActive, ErrInvalidParam, ErrNotFound } from "../../../../shared/errors";
import { MailAdapter } from "../../../../shared/adapters";
import { GenerateUserCode, TypeCode } from "../../../services/GenerateUserCode";
import { UserCode } from "../../../../domain/entities";
import { SendUserMail } from "../../../../shared/helpers/mail/SendUserMail";
import { ErrExpired } from "@/shared/errors/ErrExpired";

export interface ActivateUserRequest {
    code: string,
    userId: string
}

@injectable()
export class ActivateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,

        @inject('UserCodeRepository')
        private userCodeRepository: IUserCodeRepository,

        @inject('MailAdapter')
        private mailAdapter: MailAdapter
    ) { }

    async execute({ code, userId }: ActivateUserRequest) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new ErrNotFound('user')

        if (userExists.props.active) throw new ErrAlreadyActive('user')

        const codeExists = await this.userCodeRepository.findByCodeAndUserId({ code, userId, type: 'ACTIVATE_ACCOUNT' })
        if (!codeExists) throw new ErrInvalidParam('code')


        if (codeExists.props.expiresIn < new Date() || codeExists.props.active == false) {
            await this.userCodeRepository.changeCodeStatus(codeExists.id)
            const generateUserCode = new GenerateUserCode()
            const { code, expiresIn } = generateUserCode.execute({ type: TypeCode.string, size: 6 })

            const activateCode = UserCode.create({
                active: true,
                code,
                expiresIn,
                createdAt: new Date(),
                userId: userId,
                type: "ACTIVATE_ACCOUNT"
            })
            await this.userCodeRepository.create(activateCode)

            const sendUserMail = new SendUserMail(this.mailAdapter)
            sendUserMail.authMail({ to: userExists.props.email, code })

            throw new ErrExpired('code')
        }

        await this.userCodeRepository.changeCodeStatus(codeExists.id)
        await this.userRepository.changeStatus(userExists.id)

        return codeExists

    }
}