import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { CreateQuizUseCase } from "../createQuiz/createQuizUseCase";
import { CreateUserUseCase } from "../../user/createUser/createUserUseCase";
import { Quiz } from "@/domain/entities";
import { GetQuizUseCase } from './getQuizUseCase';
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters';
import { InMemoryUserCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository, InMemoryQuizRepository, InMemoryQuestionsRepository } from '@/tests/repositories';
import { AppError } from '@/shared/errors';

describe("Get Quiz", async () => {
    it('should return a quiz', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const createUserUseCase = new CreateUserUseCase(usersRepository, userTokenRepository, userCodeRepository, hashAdapter, securityAdapter, mailAdapter)
        const user = await createUserUseCase.execute({
            name: "Flaamer",
            email: "teste@teste.com",
            password: "teste123"
        });
        const quizRepository = new InMemoryQuizRepository()
        const questionsRepository = new InMemoryQuestionsRepository()

        const createQuiz = new CreateQuizUseCase(quizRepository, questionsRepository, usersRepository)
        const createdQuiz = await createQuiz.execute({
            title: "Matemática Básica",
            ownerId: user.id,
            questions: [
                {
                    question: "Qual a raiz de 16",
                    answers: ["4", "5", "6", "7"],
                    correctAnswer: 0
                },
                {
                    question: "Qual a raiz de 64",
                    answers: ["2", "4", "6", "8"],
                    correctAnswer: 3,
                },
                {
                    question: "Qual a raiz de 144",
                    answers: ["4", "8", "12", "16"],
                    correctAnswer: 2,
                }
            ],
            createdAt: new Date()
        })
        const sut = new GetQuizUseCase(quizRepository, questionsRepository)

        const quiz = await sut.execute({
            quizId: createdQuiz.id
        })

        expect(quiz).toBeInstanceOf(Quiz)
    })
    it('should throw an error if the quiz does not exists', async () => {
        const quizRepository = new InMemoryQuizRepository()
        const questionsRepository = new InMemoryQuestionsRepository()
        const sut = new GetQuizUseCase(quizRepository, questionsRepository)
        const quiz = sut.execute({
            quizId: 'fake_quiz_id'
        })
        
        expect(quiz).rejects.toBeInstanceOf(AppError)
    })
})