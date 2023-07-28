import { inject, injectable } from "tsyringe";
import { IUserTokenRepository, IUsersRepository } from "../../../repositories";
import { CreateSession } from "../../../services/Session/SessionService";
import { User, UserToken } from "../../../../domain/entities";
import { ErrNotFound, ErrNotActive, ErrInvalidParam } from "../../../../shared/errors";
import { HashAdapter, SecurityAdapter } from "../../../../shared/adapters";

export type AuthenticateUserRequest = {
    email: string,
    password: string
}

export interface UserTokenResponse {
    accessToken: string,
    refreshToken: string
}

export interface UserAuthenticateResponse extends User {
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

    async execute({ email, password }: AuthenticateUserRequest): Promise<UserAuthenticateResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) throw new ErrInvalidParam('email or password incorrect')

        const checkPassword = await this.hashAdapter.compare(password, user.props.password);
        if (!checkPassword) throw new ErrInvalidParam('email or password incorrect')

        if(!user.props.active) throw new ErrNotActive('user')

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

        const userWithToken = Object.assign(newUserInstance, {
            token: {
                accessToken,
                refreshToken
            }
        })

        return userWithToken;
    }
}