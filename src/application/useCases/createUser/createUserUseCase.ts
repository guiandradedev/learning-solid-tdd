import { User } from "../../../domain/entities/user";
import { IUsersRepository } from "../../repositories/IUsersRepository";

type CreateUserRequest = {
    name: string,
    email: string
}

export class CreateUserUseCase {
    constructor(
        private usersRepository: IUsersRepository
    ) {}

    async execute({name, email}: CreateUserRequest) {
        const userAlreadyExists = await this.usersRepository.findByEmail(email)

        if(userAlreadyExists) {
            throw new Error("User already exists.")
        }

        const user = User.create({name, email})

        await this.usersRepository.create(user)

        return user
    }
}