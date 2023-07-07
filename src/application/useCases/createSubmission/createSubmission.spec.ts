import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "../../../tests/repositories/in-memory-user-repository";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { InMemoryQuizRepository } from "../../../tests/repositories/in-memory-quiz-repository";
import { CreateQuizUseCase } from "../createQuiz/createQuizUseCase";
import { InMemoryQuestionsRepository } from "../../../tests/repositories/in-memory-question-repository";
import { Submission } from "../../../domain/entities/submission";
import { InMemorySubmissionsRepository } from "../../../tests/repositories/in-memory-submission-repository";
import { CreateSubmissionUseCase } from "./createSubmissionUseCase";
import { InMemoryUserTokenRepository } from '../../../tests/repositories/in-memory-user-token-repository';
import { AppError } from '../../../shared/errors/AppError';

describe("Create Submission", async () => {
    /*
     * Regras de Negócio:
     * - O quiz deve existir ✓
     * - O usuario deve existir ✓
     * - O owner Id não pode responder ao quiz ✓
     * - Não podem haver respostas em branco ✓
     * - A resposta deve ser entre 0 e o maximo de respostas -1 ✓
     * - Deve retornar um array binario correctAnswers com respostas corretas ✓
     */

    const usersRepository = new InMemoryUsersRepository();
    const userTokenRepository = new InMemoryUserTokenRepository()
    const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository)

    const user1 = await sutUser.execute({
        email: "flaamer@gmail.com",
        name: "flaamer",
        password: "teste123"
    })

    const user2 = await sutUser.execute({
        email: "flaamer1@gmail.com",
        name: "flaamer",
        password: "teste123"
    })

    const QuizRepository = new InMemoryQuizRepository();
    const QuestionRepository = new InMemoryQuestionsRepository();
    const sutQuiz = new CreateQuizUseCase(QuizRepository, QuestionRepository, usersRepository)

    const quiz1 = await sutQuiz.execute({
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

    const makeSut = (): { sut: CreateSubmissionUseCase, SubmissionsInMemoryRepository: InMemorySubmissionsRepository } => {
        const SubmissionsInMemoryRepository = new InMemorySubmissionsRepository()
        const sut = new CreateSubmissionUseCase(SubmissionsInMemoryRepository, usersRepository, QuizRepository, QuestionRepository)

        return { sut, SubmissionsInMemoryRepository }
    }

    it('should submit a test', async () => {
        const { sut } = makeSut()

        const submission = await sut.execute({
            userId: user2.id,
            quizId: quiz1.id,
            answers: [0, 3, 1],
        })

        expect(submission).toBeInstanceOf(Submission)
    })

    it('should throw an error (quiz does not exists)', async () => {
        const { sut } = makeSut()

        const dataObj = {
            userId: user2.id,
            quizId: "fake_quiz_id",
            answers: [0, 1, 2],
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Submission)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_QUIZ_NOT_FOUND"
            })
        );
    })

    it('should throw an error (user does not exists)', async () => {
        const { sut } = makeSut()

        const dataObj = {
            userId: "fake_user_id",
            quizId: quiz1.id,
            answers: [0, 1, 2],
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Submission)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_USER_NOT_FOUND"
            })
        );
    })

    it('should throw an error (owner cannot answer his own survey)', async () => {
        const { sut } = makeSut()

        const dataObj = {
            userId: user1.id,
            quizId: quiz1.id,
            answers: [0, 1, 2],
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Submission)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_OWNER_CANNOT_ANSWER"
            })
        );
    })

    it('should throw an error if it has a blank answer', async () => {
        const { sut } = makeSut()

        const dataObj = {
            userId: user2.id,
            quizId: quiz1.id,
            answers: [0, 1],
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Submission)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_BLANK_ANSWER"
            })
        );
    })

    it('should throw an error if any answer is greater than question.length or less than 0', async () => {
        const { sut } = makeSut()

        const  dataObj = {
            userId: user2.id,
            quizId: quiz1.id,
            answers: [0, 5, 2],
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Submission)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_INVALID_USER_ANSWER"
            })
        );
    })

    // it('should throw an error if')
})