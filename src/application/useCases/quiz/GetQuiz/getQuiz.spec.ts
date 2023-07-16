import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { InMemoryQuizRepository } from "../../../../tests/repositories/in-memory-quiz-repository";
import { InMemoryQuestionsRepository } from "../../../../tests/repositories/in-memory-question-repository";
import { CreateQuizUseCase } from "../createQuiz/createQuizUseCase";
import { InMemoryUsersRepository } from "../../../../tests/repositories/in-memory-user-repository";
import { CreateUserUseCase } from "../../user/createUser/createUserUseCase";
import { InMemoryUserTokenRepository } from "../../../../tests/repositories/in-memory-user-token-repository";
import { Quiz } from "../../../../domain/entities/quiz";
import { GetQuizUseCase } from './getQuizUseCase';

describe("Get Quiz", async () => {
    it('', ()=>{})

    // it('should return a quiz', async () => {
    //     const quizRepository = new InMemoryQuizRepository()
    //     const questionsRepository = new InMemoryQuestionsRepository()
    //     const userRepository = new InMemoryUsersRepository()
    //     const userTokenRepository = new InMemoryUserTokenRepository()

    //     const createUser = new CreateUserUseCase(userRepository, userTokenRepository)
    //     const user = await createUser.execute({
    //         name: "Flaamer",
    //         email: "teste@teste.com",
    //         password: "teste123"
    //     });
    //     const createQuiz = new CreateQuizUseCase(quizRepository, questionsRepository, userRepository)
    //     const createdQuiz = await createQuiz.execute({
    //         title: "Matemática Básica",
    //         ownerId: user.id,
    //         questions: [
    //             {
    //                 question: "Qual a raiz de 16",
    //                 answers: ["4", "5", "6", "7"],
    //                 correctAnswer: 0
    //             },
    //             {
    //                 question: "Qual a raiz de 64",
    //                 answers: ["2", "4", "6", "8"],
    //                 correctAnswer: 3,
    //             },
    //             {
    //                 question: "Qual a raiz de 144",
    //                 answers: ["4", "8", "12", "16"],
    //                 correctAnswer: 2,
    //             }
    //         ],
    //         createdAt: new Date()
    //     })
    //     const sut = new GetQuizUseCase(quizRepository, questionsRepository)

    //     const quiz = await sut.execute({
    //         quizId: createdQuiz.id
    //     })

    //     expect(quiz).toBeInstanceOf(Quiz)
    // })
    // it('should throw an error if the quiz does not exists', async () => { })
})