import { inject, injectable } from "tsyringe";
import { IActivateCodeRepository, IUsersRepository } from "../../../repositories";
import { ErrCodeExpired, ErrInvalidParam, ErrNotFound } from "../../../../shared/errors";
import { MailAdapter } from "../../../../shared/adapters";
import { GenerateActivateCode, TypeCode } from "./GenerateActivateCode";
import { ActivateCode } from "../../../../domain/entities";
import { SendUserMail } from "../../../../shared/helpers/mail/SendUserMail";

export interface ActivateUserRequest {
    code: string,
    userId: string
}

@injectable()
export class ActivateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,

        @inject('ActivateCodeRepository')
        private activateCodeRepository: IActivateCodeRepository,

        @inject('MailAdapter')
        private mailAdapter: MailAdapter
    ) { }

    async execute({ code, userId }: ActivateUserRequest) {
        const userExists = await this.userRepository.findById(userId)
        if(!userExists) throw new ErrNotFound('user')

        const codeExists = await this.activateCodeRepository.findByCodeAndUserId({ code, userId })
        if (!codeExists) throw new ErrInvalidParam('code')

        if (codeExists.props.expiresIn < new Date() || codeExists.props.active == false) {
            const generateActivateCode = new GenerateActivateCode()
            const { code, expiresIn } = generateActivateCode.execute({ type: TypeCode.string, size: 6 })

            const activateCode = ActivateCode.create({
                active: true,
                code,
                expiresIn,
                createdAt: new Date(),
                userId: userId
            })
            await this.activateCodeRepository.create(activateCode)

            const sendUserMail = new SendUserMail(this.mailAdapter)
            sendUserMail.authMail({ to: userExists.props.email, code })

            throw ErrCodeExpired
        }

        await this.activateCodeRepository.changeCodeStatus(codeExists.id)

        return codeExists

    }
}