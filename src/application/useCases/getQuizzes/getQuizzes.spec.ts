import 'reflect-metadata'

import { describe, expect, it } from "vitest";
import { InMemoryQuizRepository } from "../../../tests/repositories/in-memory-quiz-repository";
import { InMemoryQuestionsRepository } from "../../../tests/repositories/in-memory-question-repository";
import { CreateQuizUseCase } from "../createQuiz/createQuizUseCase";
import { InMemoryUsersRepository } from "../../../tests/repositories/in-memory-user-repository";
import { InMemorySubmissionsRepository } from "../../../tests/repositories/in-memory-submission-repository";
import { User } from "../../../domain/entities/user";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { Quiz } from "../../../domain/entities/quiz";
import { GetQuizzesUseCase } from "./getQuizzesUseCase";

describe("Get Quizzes", async () => {
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
        const usersRepository = new InMemoryUsersRepository();
        const sutUser = new CreateUserUseCase(usersRepository)

        const user1 = await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123"
        })

        const QuizRepository = new InMemoryQuizRepository();
        const QuestionRepository = new InMemoryQuestionsRepository();
        const sutQuiz = new CreateQuizUseCase(QuizRepository, QuestionRepository, usersRepository)

        const quiz = await sutQuiz.execute({
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

        expect(async () => await sut.execute()).rejects.toThrow('Quiz not found');
    })
})