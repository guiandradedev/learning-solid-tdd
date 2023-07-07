import { inject, injectable } from "tsyringe";
import { User } from "../../../domain/entities/user";
import { IUserTokenRepository } from "../../repositories/IUserTokenRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import bcrypt from 'bcrypt'
import { CreateSession } from "../../services/SessionService";
import { UserToken } from "../../../domain/entities/user-token";
import { AppError } from "../../../shared/errors/AppError";

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
        private userTokenRepository: IUserTokenRepository
    ) { }

    async execute({ email, password }: AuthenticateUserRequest): Promise<UserAuthenticatetedResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) throw new AppError({title: "ERR_USER_INVALID", message: "User or password incorrect", status: 422})

        const checkPassword = await bcrypt.compare(password, user.props.password);
        if (!checkPassword) throw new AppError({title: "ERR_USER_INVALID", message: "User or password incorrect", status: 422})

        const sessionService = new CreateSession()
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