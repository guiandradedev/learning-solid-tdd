import { User } from "../../../domain/entities/user";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
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
        private usersRepository: IUsersRepository
    ) { }

    async execute({ name, email, password }: CreateUserRequest) {
        const userAlreadyExists = await this.usersRepository.findByEmail(email)

        if (userAlreadyExists) {
            throw new Error("User already exists.")
        }

        const salt = await bcrypt.genSalt(saltValue);
        const passwordHash = await bcrypt.hash(password, salt);
        password = passwordHash;

        const user = User.create({ name, email, password })

        await this.usersRepository.create(user)

        return user
    }
}