import { User } from "../../../domain/entities/user";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { IUserTokenRepository } from "../../repositories/IUserTokenRepository";
import { CreateSession } from "../../services/SessionService";
import { UserToken } from "../../../domain/entities/user-token";
import { UserAuthenticatetedResponse } from "../authenticateUser/authenticateUserUseCase";
import { AppError } from "../../../shared/errors/AppError";
export const saltValue = 12

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
        private userTokenRepository: IUserTokenRepository
    ) { }

    async execute({ name, email, password }: CreateUserRequest): Promise<UserAuthenticatetedResponse> {
        const userAlreadyExists = await this.usersRepository.findByEmail(email)
        if (userAlreadyExists) throw new AppError({title: "ERR_USER_ALREADY_EXISTS", message: "User already exists", status: 500})

        const salt = await bcrypt.genSalt(saltValue);
        const passwordHash = await bcrypt.hash(password, salt);
        password = passwordHash;

        const user = User.create({ name, email, password })
        await this.usersRepository.create(user)

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

        const userWithToken = Object.assign(user, { token: userToken })

        return userWithToken;
    }
}