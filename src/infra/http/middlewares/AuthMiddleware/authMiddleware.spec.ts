import 'reflect-metadata'

import { describe, expect, it, vitest } from "vitest";
import { AuthMiddlewareService } from "./authMiddlewareService";
import { InMemoryActivateCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository } from "../../../../tests/repositories";
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from "../../../../tests/adapters";
import { CreateUserUseCase } from "../../../../application/useCases/user/createUser/createUserUseCase";
import { User } from "../../../../domain/entities";
import { SecurityAdapter } from '../../../../shared/adapters';
import { IUsersRepository } from 'application/repositories';
import { UserAuthenticatetedResponse } from 'application/useCases/user/authenticateUser/authenticateUserUseCase';
import { v4 as uuidv4 } from 'uuid';
import { ErrTokenInvalid, ErrUserNotFound } from '../../../../shared/errors';

describe("AuthMiddlewareService", () => {
    type TypeSut = {
        usersRepository: IUsersRepository
        securityAdapter: SecurityAdapter
        userSut: CreateUserUseCase
        user: UserAuthenticatetedResponse,
        sut: AuthMiddlewareService
    }
    const makeSut = async (): Promise<TypeSut> => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const activateCodeRepository = new InMemoryActivateCodeRepository()
        const userSut = new CreateUserUseCase(usersRepository, userTokenRepository, activateCodeRepository, hashAdapter, securityAdapter, mailAdapter)
        const user = await userSut.execute({
            name: "Flaamer",
            email: "teste@teste.com",
            password: "teste123"
        })

        const sut = new AuthMiddlewareService(usersRepository, securityAdapter)

        return {
            usersRepository,
            securityAdapter,
            userSut,
            user,
            sut,
        }
    }
    it('should pass if user exists and token is valid', async () => {
        const { sut, user } = await makeSut()
        const userData = await sut.execute({ token: user.token.accessToken })

        expect(userData).toBeInstanceOf(User)
    })

    it('should throw an error if user does not exists', async () => {
        const { sut, user, usersRepository } = await makeSut()
        vitest.spyOn(usersRepository, 'findById').mockReturnValue(null)
        const userData = sut.execute({ token: user.token.accessToken })

        expect(userData).rejects.toEqual(ErrUserNotFound)
     })

    it('should throw an error if token is not valid', async () => { 
        const { sut } = await makeSut()
        const userData = sut.execute({ token: uuidv4() })

        expect(userData).rejects.toEqual(ErrTokenInvalid)
        
    })

    // it('should')
})

describe("AuthMiddlewareController", () => {
    it('', () => { })
})