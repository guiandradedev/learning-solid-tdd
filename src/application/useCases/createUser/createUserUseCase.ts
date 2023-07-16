import { inject, injectable } from "tsyringe";
import { User, UserToken } from "../../../domain/entities";
import { IUsersRepository, IUserTokenRepository } from "../../repositories";
import { CreateSession } from "../../services/SessionService";
import { UserAuthenticatetedResponse } from "../authenticateUser/authenticateUserUseCase";
import { AppError } from "../../../shared/errors";
import { HashAdapter, SecurityAdapter } from "shared/adapters";

type CreateUserRequest = {
    name: string,
    email: string
    password: string
}

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,

        @inject('HashAdapter')
        private hashAdapter: HashAdapter,

        @inject('SecurityAdapter')
        private securityAdapter: SecurityAdapter
    ) { }

    async execute({ name, email, password }: CreateUserRequest): Promise<UserAuthenticatetedResponse> {
        const userAlreadyExists = await this.usersRepository.findByEmail(email)
        if (userAlreadyExists) throw new AppError({ title: "ERR_USER_ALREADY_EXISTS", message: "User already exists", status: 500 })

        const passwordHash = await this.hashAdapter.hash(password)
        password = passwordHash;

        const user = User.create({ name, email, password })
        await this.usersRepository.create(user)

        const sessionService = new CreateSession(this.securityAdapter)
        const { accessToken, refreshToken, refreshTokenExpiresDate, accessTokenExpiresDate } = await sessionService.execute(email, user.id)

        const userToken = UserToken.create({
            createdAt: new Date(),
            refreshTokenExpiresDate,
            refreshToken,
            userId: user.id
        })
        await this.userTokenRepository.create(userToken)

        const userWithToken = Object.assign(user, { token: {
            accessToken,
            refreshToken
        } })

        return userWithToken;
    }
}