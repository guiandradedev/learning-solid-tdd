import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { InMemoryQuizRepository, InMemoryQuestionsRepository, InMemoryUsersRepository, InMemoryUserTokenRepository, InMemoryUserCodeRepository } from "@/tests/repositories";
import { CreateQuizUseCase } from "@/modules/quiz/services/createQuiz/createQuizUseCase";
import { Quiz, Question } from "@/modules/quiz/domain";
import { CreateUserUseCase } from "@/modules/user/services/createUser/createUserUseCase";
import { GetQuizzesUseCase } from "./getQuizzesUseCase";
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters';
import { AppError } from '@/shared/errors';

describe("Get Quizzes", async () => {
    it('', () => { })

    /*
     * Regras de Negócios
     * - Deve retornar todos os quizzes armazenados
     * - Deve retornar um erro caso não exista quizzes armazenados
     */
    const makeSut = async () => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const hashAdapter = new InMemoryHashAdapter();
        const securityAdapter = new InMemorySecurityAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository, userCodeRepository, hashAdapter, securityAdapter, mailAdapter)

        const user1 = await sutUser.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123"
        })

        const QuizRepository = new InMemoryQuizRepository();
        const QuestionRepository = new InMemoryQuestionsRepository();
        const sutQuiz = new CreateQuizUseCase(QuizRepository, QuestionRepository, usersRepository)

        const quizQuestions = [
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
        ]

        await sutQuiz.execute({
            title: "Matemática Básica",
            ownerId: user1.id,
            questions: quizQuestions,
            createdAt: new Date()
        })

        const sut = new GetQuizzesUseCase(QuizRepository, QuestionRepository)

        return { sut, QuizRepository, QuestionRepository, sutQuiz, user: user1, quizQuestions }
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
        const { quizQuestions, sut } = await makeSut()

        const quizzes = await sut.execute()

        expect(quizzes.every((quiz) => quiz.questions.every((question) => question instanceof Question))).toBe(true);

        const questionsMapped = quizzes[0].questions.map((question)=>({
            answers: question.props.answers,
            correctAnswer: question.props.correctAnswer,
            question: question.props.question
        }))
        expect(questionsMapped).toEqual(quizQuestions)
    })
})