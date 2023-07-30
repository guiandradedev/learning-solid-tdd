import 'reflect-metadata'

import { describe, expect, it, vitest } from "vitest";
import { AuthMiddlewareService } from "./authMiddlewareService";
import { InMemoryUserCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository } from "@/tests/repositories";
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from "@/tests/adapters";
import { CreateUserUseCase } from "@/modules/user/services/createUser/createUserUseCase";
import { User } from "@/modules/user/domain";
import { ISecurityAdapter } from '@/modules/user/adapters';
import { IUsersRepository } from '@/modules/user/repositories';
import { v4 as uuidv4 } from 'uuid';
import { ErrInvalidParam, ErrNotActive, ErrNotFound } from '@/shared/errors';
import { UserAuthenticateResponse } from '@/modules/user/protocols';

describe("AuthMiddlewareService", () => {
    type TypeSut = {
        usersRepository: IUsersRepository
        securityAdapter: ISecurityAdapter
        userSut: CreateUserUseCase
        user: UserAuthenticateResponse,
        sut: AuthMiddlewareService
    }
    const makeSut = async (): Promise<TypeSut> => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const userSut = new CreateUserUseCase(usersRepository, userTokenRepository, userCodeRepository, hashAdapter, securityAdapter, mailAdapter)
        const user = await userSut.execute({
            name: "Flaamer",
            email: "teste@teste.com",
            password: "teste123", 
            active: true
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

        expect(userData).rejects.toBeInstanceOf(ErrNotFound)
     })

    it('should throw an error if token is not valid', async () => { 
        const { sut } = await makeSut()
        const userData = sut.execute({ token: uuidv4() })

        expect(userData).rejects.toBeInstanceOf(ErrInvalidParam)
        
    })

    it('should throw an error if user is not active', async () => {
        const { sut, userSut } = await makeSut()
        const user = await userSut.execute({
            name: "Flaamer",
            email: "teste1@teste.com",
            password: "teste123", 
            active: false
        })

        const userData = sut.execute({ token: user.token.accessToken })

        expect(userData).rejects.toBeInstanceOf(ErrNotActive)
    })
})

describe("AuthMiddlewareController", () => {
    it('', () => { })
})