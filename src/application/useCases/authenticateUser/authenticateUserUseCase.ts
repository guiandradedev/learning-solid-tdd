import { inject, injectable } from "tsyringe";
import { IUserTokenRepository, IUsersRepository } from "../../repositories";
import { CreateSession } from "../../services/SessionService";
import { User, UserToken } from "../../../domain/entities";
import { AppError } from "../../../shared/errors";
import { HashAdapter, SecurityAdapter } from "../../../shared/adapters";

type AuthenticateUserRequest = {
    email: string,
    password: string
}

export interface UserAuthenticatetedResponse extends User {
    token: UserToken
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

        if (!user) throw new AppError({title: "ERR_USER_INVALID", message: "User or password incorrect", status: 422})

        const checkPassword = await this.hashAdapter.compare(password, user.props.password);
        if (!checkPassword) throw new AppError({title: "ERR_USER_INVALID", message: "User or password incorrect", status: 422})

        const sessionService = new CreateSession(this.securityAdapter)
        const { accessToken, refreshToken, refreshTokenExpiresDate, accessTokenExpiresDate } = await sessionService.execute(email, user.id)

        const userToken = UserToken.create({
            createdAt: new Date(),
            refreshTokenExpiresDate,
            accessTokenExpiresDate,
            accessToken,
            refreshToken,
            userId: user.id
        })
        await this.userTokenRepository.create(userToken)

        const userWithToken = Object.assign(user, {token: userToken})

        return userWithToken;
    }
}