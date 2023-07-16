import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { InMemoryQuizRepository, InMemoryQuestionsRepository,    InMemoryUsersRepository,    InMemorySubmissionsRepository,    InMemoryUserTokenRepository } from "../../../tests/repositories";
import { CreateQuizUseCase } from "../createQuiz/createQuizUseCase";
import { User, Quiz } from "../../../domain/entities";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { GetQuizzesUseCase } from "./getQuizzesUseCase";
import { InMemoryHashAdapter, InMemorySecurityAdapter } from '../../../tests/adapters';

describe("Get Quizzes", async () => {
    it('', ()=>{})

    /*
     * Regras de Negócios
     * - Deve retornar todos os quizzes armazenados
     * - Deve retornar um erro caso não exista quizzes armazenados
     */

    type returnSut = {
        sut: GetQuizzesUseCase,
        QuizRepository: InMemoryQuizRepository,
        QuestionRepository: InMemoryQuestionsRepository,
    }

    const makeSut = async (): Promise<returnSut> => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository, hashAdapter, securityAdapter)

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

        return { sut, QuizRepository, QuestionRepository }
    }

    it('should return all stored quizzes', async ()=>{
        const {sut} = await makeSut()

        const quizzes = await sut.execute()

        expect(quizzes.every((quiz) => quiz instanceof Quiz)).toBe(true);
    })

    it('should throw an error if does not have any quiz stored', async  () => {
        const QuizRepository = new InMemoryQuizRepository();
        const QuestionRepository = new InMemoryQuestionsRepository();
        const sut = new GetQuizzesUseCase(QuizRepository, QuestionRepository)

        expect(async () => await sut.execute()).not.toBeInstanceOf(Quiz)
        // expect(async () => await sut.execute()).rejects.not.toEqual(expect.arrayContaining(expect.any(Quiz)));
        expect(async () => await sut.execute()).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_QUIZ_NOT_FOUND"
            })
        );
    })

    it('should return all questions', async () => {
        
    })


})