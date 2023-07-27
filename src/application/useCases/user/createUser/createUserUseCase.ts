import { inject, injectable } from "tsyringe";
import { ActivateCode, User, UserToken } from "../../../../domain/entities";
import { IActivateCodeRepository, IUsersRepository, IUserTokenRepository } from "../../../repositories";
import { CreateSession } from "../../../services/SessionService";
import { UserAuthenticatetedResponse } from "../authenticateUser/authenticateUserUseCase";
import { ErrAlreadyExists } from "@/shared/errors";
import { HashAdapter, SecurityAdapter, MailAdapter } from "../../../../shared/adapters";
import { GenerateActivateCode, TypeCode } from '../activateUser/GenerateActivateCode'
import { SendUserMail } from "../../../../shared/helpers/mail/SendUserMail";

type CreateUserRequest = {
    name: string,
    email: string
    password: string,
    active?: boolean
}

export interface CreateUserResponse extends UserAuthenticatetedResponse {
    code: {
        code: string,
        expiresIn: Date
    }
}

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,

        @inject('ActivateCodeRepository')
        private activateCodeRepository: IActivateCodeRepository,

        @inject('HashAdapter')
        private hashAdapter: HashAdapter,

        @inject('SecurityAdapter')
        private securityAdapter: SecurityAdapter,

        @inject('MailAdapter')
        private mailAdapter: MailAdapter
    ) { }

    async execute({ name, email, password, active }: CreateUserRequest): Promise<CreateUserResponse> {
        const userAlreadyExists = await this.usersRepository.findByEmail(email)
        if (userAlreadyExists) throw new ErrAlreadyExists('user')

        const passwordHash = await this.hashAdapter.hash(password)
        password = passwordHash;

        const user = User.create({ name, email, password, active: active ?? false })

        await this.usersRepository.create(user)

        const sessionService = new CreateSession(this.securityAdapter)
        const { accessToken, refreshToken, refreshTokenExpiresDate } = await sessionService.execute(email, user.id)

        const userToken = UserToken.create({
            createdAt: new Date(),
            refreshTokenExpiresDate,
            refreshToken,
            userId: user.id
        })
        await this.userTokenRepository.create(userToken)

        const generateActivateCode = new GenerateActivateCode()
        const {code, expiresIn} = generateActivateCode.execute({ type: TypeCode.string, size: 6 })

        const activateCode = ActivateCode.create({
            active: true,
            code,
            expiresIn,
            createdAt: new Date(),
            userId: user.id
        })
        await this.activateCodeRepository.create(activateCode)

        const sendUserMail = new SendUserMail(this.mailAdapter)
        sendUserMail.authMail({to: email, code})

        const userReturn = Object.assign(user, {
            token: {
                accessToken,
                refreshToken
            },
            code: {
                code,
                expiresIn
            }
        })

        return userReturn;
    }
}