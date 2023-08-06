import { inject, injectable } from "tsyringe";
import { UserCode, User, UserToken } from "@/modules/user/domain";
import { IUserCodeRepository, IUsersRepository, IUserTokenRepository } from "@/modules/user/repositories";
import { CreateSession } from "@/modules/user/utils/Session/SessionService";
import { ErrAlreadyExists } from "@/shared/errors";
import { IHashAdapter, ISecurityAdapter, IMailAdapter } from "@/modules/user/adapters";
import { GenerateUserCode, TypeCode } from '@/modules/user/utils/GenerateUserCode'
import { SendUserMail } from "@/modules/user/helpers/";
import { CreateUserRequest, UserAuthenticateResponse } from "@/modules/user/protocols";

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
        private hashAdapter: IHashAdapter,

        @inject('SecurityAdapter')
        private securityAdapter: ISecurityAdapter,

        @inject('MailAdapter')
        private mailAdapter: IMailAdapter
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

        const newUserInstance = User.create({ ...user.props }, user.id)

        const userReturn: UserAuthenticateResponse = Object.assign(newUserInstance, {
            token: {
                accessToken,
                refreshToken
            }
        })

        if (!active) {
            const generateUserCode = new GenerateUserCode()

            const date = new Date();
            date.setHours(date.getHours() + 3);

            const { code, expiresIn } = generateUserCode.execute({ type: TypeCode.string, size: 6, expiresIn: date })

            const userCode = UserCode.create({
                active: true,
                code,
                expiresIn,
                createdAt: new Date(),
                userId: user.id,
                type: "ACTIVATE_ACCOUNT"
            })
            await this.UserCodeRepository.create(userCode)

            const sendUserMail = new SendUserMail(this.mailAdapter)
            await sendUserMail.authMail({ to: email, code })
        }

        return userReturn;
    }
}