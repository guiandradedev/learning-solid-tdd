import { inject, injectable } from "tsyringe";
import { IUserTokenRepository, IUsersRepository } from "../../../repositories";
import { CreateSession } from "../../../services/SessionService";
import { User, UserToken } from "../../../../domain/entities";
import { AppError, ErrNotFound, ErrUserNotActive } from "../../../../shared/errors";
import { HashAdapter, SecurityAdapter } from "../../../../shared/adapters";

type AuthenticateUserRequest = {
    email: string,
    password: string
}

export interface UserTokenResponse {
    accessToken: string,
    refreshToken: string
}

export interface UserAuthenticatetedResponse extends User {
    token: UserTokenResponse
}

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,
        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,

        @inject('HashAdapter')
        private hashAdapter: HashAdapter,

        @inject('SecurityAdapter')
        private securityAdapter: SecurityAdapter
    ) { }

    async execute({ email, password }: AuthenticateUserRequest): Promise<UserAuthenticatetedResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) throw new ErrNotFound('user')

        const checkPassword = await this.hashAdapter.compare(password, user.props.password);
        if (!checkPassword) throw new ErrNotFound('user')

        // if(!user.props.active) throw ErrUserNotActive

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

        return userWithToken;
    }
}