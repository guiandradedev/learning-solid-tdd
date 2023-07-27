import { User } from "@/domain/entities";

type ResetPasswordRequest = {
    code: string,
    password: string,
    confirmPassword: string
}

export class ResetPasswordUseCase {
    constructor(){}

    async execute({}: ResetPasswordRequest): Promise<User> {
        return User.create({
            name: "",
            email: "",
            password: "",
            active: true
        })
    }
}