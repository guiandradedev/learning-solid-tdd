import { inject, injectable } from "tsyringe";
import { ActivateCode, User, UserToken } from "../../../../domain/entities";
import { IActivateCodeRepository, IUsersRepository, IUserTokenRepository } from "../../../repositories";
import { CreateSession } from "../../../services/SessionService";
import { UserAuthenticatetedResponse } from "../authenticateUser/authenticateUserUseCase";
import { AppError } from "../../../../shared/errors";
import { HashAdapter, SecurityAdapter, MailAdapter } from "../../../../shared/adapters";
import { GenerateActivateCode, TypeCode } from './GenerateActivateCode'
import { SendUserMail } from "../../../../shared/helpers/mail/SendUserMail";

type CreateUserRequest = {
    name: string,
    email: string
    password: string,
    active?: boolean
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

    async execute({ name, email, password, active }: CreateUserRequest): Promise<UserAuthenticatetedResponse> {
        const userAlreadyExists = await this.usersRepository.findByEmail(email)
        if (userAlreadyExists) throw new AppError({ title: "ERR_USER_ALREADY_EXISTS", message: "User already exists", status: 500 })

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

        const userWithToken = Object.assign(user, {
            token: {
                accessToken,
                refreshToken
            }
        })

        const generateActivateCode = new GenerateActivateCode()
        const code = generateActivateCode.execute({ type: TypeCode.string, size: 6 })

        const activateCode = ActivateCode.create({
            active: false,
            code,
            createdAt: new Date(),
            userId: user.id
        })
        await this.activateCodeRepository.create(activateCode)

        const sendUserMail = new SendUserMail(this.mailAdapter)
        sendUserMail.authMail({to: email, code})

        return userWithToken;
    }
}