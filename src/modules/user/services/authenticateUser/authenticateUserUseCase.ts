import { inject, injectable } from "tsyringe";
import { IUserTokenRepository, IUsersRepository } from "@/modules/user/repositories";
import { CreateSession } from "@/modules/user/utils/Session/SessionService";
import { User, UserToken } from "@/modules/user/domain";
import { ErrNotActive, ErrInvalidParam } from "@/shared/errors";
import { IHashAdapter, ISecurityAdapter } from "@/modules/user/adapters";
import { AuthenticateUserRequest, UserAuthenticateResponse } from "@/modules/user/protocols";

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,
        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,

        @inject('HashAdapter')
        private hashAdapter: IHashAdapter,

        @inject('SecurityAdapter')
        private securityAdapter: ISecurityAdapter
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