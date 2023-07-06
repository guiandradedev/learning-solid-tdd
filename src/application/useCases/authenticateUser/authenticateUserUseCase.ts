import { injectable } from "tsyringe";
import { User } from "../../../domain/entities/user";
import { IUserTokenRepository } from "../../repositories/IUserTokenRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import bcrypt from 'bcrypt'

type AuthenticateUserRequest = {
    email: string,
    password: string
}

// @injectable()
export class AuthenticateUserUseCase {
    constructor(
        private userRepository: IUsersRepository,
        private userTokenRepository: IUserTokenRepository
    ) { }

    async execute({ email, password }: AuthenticateUserRequest): Promise<User> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) throw new Error("User or password incorrect")

        const checkPassword = await bcrypt.compare(password, user.props.password);
        if (!checkPassword) throw new Error("User or password incorrect")

        

        return user;
    }
}