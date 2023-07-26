import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { InMemoryQuizRepository, InMemoryQuestionsRepository, InMemoryUsersRepository, InMemorySubmissionsRepository, InMemoryUserTokenRepository, InMemoryActivateCodeRepository } from "../../../../tests/repositories";
import { CreateQuizUseCase } from "../../quiz/createQuiz/createQuizUseCase";
import { User, Quiz, Question } from "../../../../domain/entities";
import { CreateUserUseCase } from "../../user/createUser/createUserUseCase";
import { GetQuizzesUseCase } from "./getQuizzesUseCase";
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '../../../../tests/adapters';
import { AppError } from '@/shared/errors';

describe("Get Quizzes", async () => {
    it('', () => { })

    /*
     * Regras de Negócios
     * - Deve retornar todos os quizzes armazenados
     * - Deve retornar um erro caso não exista quizzes armazenados
     */

    type returnSut = {
        sut: GetQuizzesUseCase,
        QuizRepository: InMemoryQuizRepository,
        QuestionRepository: InMemoryQuestionsRepository,
        sutQuiz: CreateQuizUseCase,
        user: User
    }

    const makeSut = async (): Promise<returnSut> => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const activateCodeRepository = new InMemoryActivateCodeRepository()
        const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository, activateCodeRepository, hashAdapter, securityAdapter, mailAdapter)

        const user1 = await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123"
        })

        const QuizRepository = new InMemoryQuizRepository();
        const QuestionRepository = new InMemoryQuestionsRepository();
        const sutQuiz = new CreateQuizUseCase(QuizRepository, QuestionRepository, usersRepository)

        await sutQuiz.execute({
            title: "Matemática Básica",
            ownerId: user1.id,
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

        const sut = new GetQuizzesUseCase(QuizRepository, QuestionRepository)

        return { sut, QuizRepository, QuestionRepository, sutQuiz, user: user1 }
    }

    it('should return all stored quizzes', async () => {
        const { sut } = await makeSut()

        const quizzes = await sut.execute()

        expect(quizzes.every((quiz) => quiz instanceof Quiz)).toBe(true);
    })

    it('should throw an error if does not have any quiz stored', async () => {
        const QuizRepository = new InMemoryQuizRepository();
        const QuestionRepository = new InMemoryQuestionsRepository();
        const sut = new GetQuizzesUseCase(QuizRepository, QuestionRepository)
        const quizzes = sut.execute()

        expect(quizzes).rejects.not.toBeInstanceOf(Quiz)
        // expect(async () => await sut.execute()).rejects.not.toEqual(expect.arrayContaining(expect.any(Quiz)));
        expect(quizzes).rejects.toBeInstanceOf(AppError)
    })

    it('should return all questions', async () => {
        const { QuestionRepository, sutQuiz, user, sut } = await makeSut()

        await sutQuiz.execute({
            title: "Matemática Básica",
            ownerId: user.id,
            questions: [
                {
                    question: "Pergunta 1",
                    answers: ["a", "b", "c", "d"],
                    correctAnswer: 0
                },
                {
                    question: "Pergunta 2",
                    answers: ["a", "b", "c", "d"],
                    correctAnswer: 3,
                },
                {
                    question: "Pergunta 3",
                    answers: ["a", "b", "c", "d"],
                    correctAnswer: 2,
                }
            ],
            createdAt: new Date()
        })

        const quizzes = await sut.execute()

        expect(quizzes.every((quiz) => quiz.questions.every((question) => question instanceof Question))).toBe(true);
    })
})