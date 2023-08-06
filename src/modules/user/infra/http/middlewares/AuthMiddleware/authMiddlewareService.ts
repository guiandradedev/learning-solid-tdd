import { inject, injectable } from "tsyringe";
import { ISecurityAdapter } from "@/modules/user/adapters";
import { AppError, ErrServerError, ErrInvalidParam, ErrNotFound, ErrNotActive } from "@/shared/errors";
import { IUsersRepository } from "@/modules/user/repositories";
import { User } from "@/modules/user/domain";

type AuthMiddlewareDTO = {
    token: string
}

@injectable()
export class AuthMiddlewareService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('SecurityAdapter')
        private securityAdapter: ISecurityAdapter
    ) { }

    async execute({ token }: AuthMiddlewareDTO): Promise<User> {
        try {
            const decrypt = this.securityAdapter.decrypt(token, process.env.ACCESS_TOKEN)
            if (!decrypt) throw new ErrInvalidParam('token');

            const user = await this.usersRepository.findById(decrypt.subject)

            if (!user) throw new ErrNotFound('user');

            if(!user.props.active) throw new ErrNotActive('user')

            return user;
        } catch (error) {
            if(error instanceof AppError) {
                throw error
            }
            throw new ErrServerError()
        }
    }
}