import { IUserCodeRepository } from "@/application/repositories";
import { User } from "@/domain/entities";
import { ErrInvalidParam } from "@/shared/errors";
import { inject, injectable } from "tsyringe";

type ResetPasswordRequest = {
    code: string,
    password: string,
    confirmPassword: string
}

@injectable()
export class ResetPasswordUseCase {
    constructor(
        @inject('userCodeRepository')
        private userCodeRepository: IUserCodeRepository,
    ){}

    async execute({code}: ResetPasswordRequest): Promise<User> {
        const codeExists = await this.userCodeRepository.findByCode({code, type: 'FORGOT_PASSWORD'})
        if(!codeExists) throw new ErrInvalidParam('code')

        return User.create({
            name: "",
            email: "",
            password: "",
            active: true
        })
    }
}