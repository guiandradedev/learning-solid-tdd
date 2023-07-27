import 'reflect-metadata'
import 'dotenv/config'

import { it, expect, describe } from "vitest";
import { CreateQuizProps, CreateQuizUseCase } from "./createQuizUseCase";
import { Quiz } from "../../../../domain/entities";
import { CreateUserUseCase } from "../../user/createUser/createUserUseCase";
import { IQuizRepository, IQuestionRepository } from "../../../repositories";
import { ErrInvalidParam, ErrNotFound } from '../../../../shared/errors';
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '../../../../tests/adapters';
import { InMemoryUserCodeRepository, InMemoryQuestionsRepository, InMemoryQuizRepository, InMemoryUsersRepository, InMemoryUserTokenRepository } from '../../../../tests/repositories';


/*
 * Regras de Negócio:
 * O usuario deve existir ✓
 * Um usuario pode criar um quiz, ✓
 * Um quiz deve ter ao menos uma pergunta✓
 * Cada pergunta deve ter ao menos duas respostas✓
 * A resposta correta deve ser entre 0->total de respostas-1 ✓
 */

describe("Quiz", async () => {
    it('', () => { })

    const usersRepository = new InMemoryUsersRepository()
    const userTokenRepository = new InMemoryUserTokenRepository()
    const hashAdapter = new InMemoryHashAdapter()
    const securityAdapter = new InMemorySecurityAdapter()
    const mailAdapter = new InMemoryMailAdapter()
    const userCodeRepository = new InMemoryUserCodeRepository()
    const userAdapter = new CreateUserUseCase(usersRepository, userTokenRepository, userCodeRepository, hashAdapter, securityAdapter, mailAdapter)

    const user1 = await userAdapter.execute({
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

        const dataObj: CreateQuizProps = {
            title: "Quiz",
            questions: [],
            ownerId: user1.id,
            createdAt: new Date()
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Quiz)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(ErrInvalidParam)
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
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(ErrInvalidParam)
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
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(ErrInvalidParam)
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
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(ErrNotFound)

    })

})