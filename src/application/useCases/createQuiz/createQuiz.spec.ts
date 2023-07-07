import 'reflect-metadata'
import 'dotenv/config'

import { it, expect, describe } from "vitest";
import { CreateQuizUseCase } from "./createQuizUseCase";
import { Quiz } from "../../../domain/entities/quiz";
import { InMemoryQuizRepository } from "../../../tests/repositories/in-memory-quiz-repository";
import { InMemoryQuestionsRepository } from "../../../tests/repositories/in-memory-question-repository";
import { InMemoryUsersRepository } from "../../../tests/repositories/in-memory-user-repository";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { IQuizRepository } from "../../repositories/IQuizRepository";
import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { InMemoryUserTokenRepository } from '../../../tests/repositories/in-memory-user-token-repository';
import { AppError } from '../../../shared/errors/AppError';

/*
 * Regras de Negócio:
 * O usuario deve existir ✓
 * Um usuario pode criar um quiz, ✓
 * Um quiz deve ter ao menos uma pergunta✓
 * Cada pergunta deve ter ao menos duas respostas✓
 * A resposta correta deve ser entre 0->total de respostas-1 ✓
 */

describe("Quiz", async () => {
    const usersRepository = new InMemoryUsersRepository()
    const userTokenRepository = new InMemoryUserTokenRepository()
    const sut = new CreateUserUseCase(usersRepository, userTokenRepository)

    const user1 = await sut.execute({
        email: "flaamer@gmail.com",
        name: "Guilherme",
        password: "teste123"
    })

    const makeSut = (): { sut: CreateQuizUseCase, quizRepository: IQuizRepository, questionsRepository: IQuestionRepository } => {
        const quizRepository = new InMemoryQuizRepository()
        const questionsRepository = new InMemoryQuestionsRepository()
        const sut = new CreateQuizUseCase(quizRepository, questionsRepository, usersRepository)

        return { sut, quizRepository, questionsRepository }
    }

    it('user should create a quiz', async () => {
        const { sut } = makeSut()

        const quiz = await sut.execute({
            title: "Quiz",
            questions: [
                {
                    question: "Qual a raiz de 64",
                    answers: ["2", "4", "6", "8"],
                    correctAnswer: 3,
                }
            ],
            ownerId: user1.id,
            createdAt: new Date()
        })

        expect(quiz).toBeInstanceOf(Quiz)
    })

    it('should not create if do not have any questions', async () => {
        const { sut } = makeSut()

        const dataObj = {
            title: "Quiz",
            questions: [],
            ownerId: user1.id,
            createdAt: new Date()
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Quiz)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_INVALID_QUESTIONS"
            })
        );
    })

    it('should throw an error if at least one question does not have at least two answers', async () => {
        const { sut } = makeSut()

        const dataObj = {
            title: "Quiz",
            questions: [
                {
                    question: "Qual a raiz de 16",
                    answers: ["4"],
                    correctAnswer: 0
                },
                {
                    question: "Qual a raiz de 64",
                    answers: ["2", "4", "6", "8"],
                    correctAnswer: 3,
                }
            ],
            ownerId: user1.id,
            createdAt: new Date()
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Quiz)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_NUMBER_INVALID_ANSWERS"
            })
        );
    })

    it('should throw an error the correct answer > answers.length -1 or answer < 0', async () => {
        const { sut } = makeSut()

        const dataObj = {
            title: "Quiz",
            questions: [
                {
                    question: "Qual a raiz de 16",
                    answers: ["4", "5"],
                    correctAnswer: 3
                },

            ],
            ownerId: user1.id,
            createdAt: new Date()
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Quiz)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_INVALID_ANSWERS"
            })
        );
    })

    it('should throw an error if ownerId does not exists', async () => {
        const { sut } = makeSut()

        const dataObj = {
            title: "Quiz",
            questions: [
                {
                    question: "Qual a raiz de 16",
                    answers: ["4", "5"],
                    correctAnswer: 0
                },

            ],
            ownerId: "fake_user_id",
            createdAt: new Date()
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Quiz)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_USER_NOT_FOUND"
            })
        );

    })

})