import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { SecurityAdapter } from "../../../../shared/adapters";
import { AppError, ErrInternalServerError, ErrTokenInvalid, ErrUserNotFound } from "../../../../shared/errors";
import { IUsersRepository } from "../../../../application/repositories";
import { User } from "../../../../domain/entities";

type AuthMiddlewareDTO = {
    token: string
}

@injectable()
export class AuthMiddlewareService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('SecurityAdapter')
        private securityAdapter: SecurityAdapter
    ) { }

    async execute({ token }: AuthMiddlewareDTO): Promise<User | null> {
        try {
            const decrypt = this.securityAdapter.decrypt(token, process.env.ACCESS_TOKEN)
            if (!decrypt) throw ErrTokenInvalid;

            const user = await this.usersRepository.findById(decrypt.subject)

            if (!user) throw ErrUserNotFound;

            return user;
        } catch (error) {
            if(error instanceof AppError) {
                throw error
            }
            throw ErrInternalServerError
        }
    }
}