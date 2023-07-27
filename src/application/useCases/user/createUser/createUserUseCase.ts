import { inject, injectable } from "tsyringe";
import { UserCode, User, UserToken } from "../../../../domain/entities";
import { IUserCodeRepository, IUsersRepository, IUserTokenRepository } from "../../../repositories";
import { CreateSession } from "../../../services/Session/SessionService";
import { UserAuthenticateResponse } from "../authenticateUser/authenticateUserUseCase";
import { ErrAlreadyExists } from "@/shared/errors";
import { HashAdapter, SecurityAdapter, MailAdapter } from "../../../../shared/adapters";
import { GenerateUserCode, TypeCode } from '../../../services/GenerateUserCode'
import { SendUserMail } from "../../../../shared/helpers/mail/SendUserMail";

export type CreateUserRequest = {
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

        @inject('UserCodeRepository')
        private UserCodeRepository: IUserCodeRepository,

        @inject('HashAdapter')
        private hashAdapter: HashAdapter,

        @inject('SecurityAdapter')
        private securityAdapter: SecurityAdapter,

        @inject('MailAdapter')
        private mailAdapter: MailAdapter
    ) { }

    async execute({ name, email, password, active }: CreateUserRequest): Promise<UserAuthenticateResponse> {
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

        const newUserInstance = User.create({...user.props}, user.id)

        const userReturn: UserAuthenticateResponse = Object.assign(newUserInstance, {
            token: {
                accessToken,
                refreshToken
            }
        })

        if(!active) {
            const generateUserCode = new GenerateUserCode()
            const {code, expiresIn} = generateUserCode.execute({ type: TypeCode.string, size: 6 })
    
            const userCode = UserCode.create({
                active: true,
                code,
                expiresIn,
                createdAt: new Date(),
                userId: user.id,
                type: "ACTIVATE_ACCOUNT"
            })
            await this.UserCodeRepository.create(userCode)

            console.log(code)
    
            // const sendUserMail = new SendUserMail(this.mailAdapter)
            // await sendUserMail.authMail({to: email, code})
        }

        return userReturn;
    }
}