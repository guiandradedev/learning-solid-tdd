import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { InMemoryQuizRepository, InMemoryQuestionsRepository, InMemoryUsersRepository, InMemorySubmissionsRepository, InMemoryUserTokenRepository, InMemoryUserCodeRepository } from "../../../../tests/repositories";
import { CreateQuizUseCase } from "../../quiz/createQuiz/createQuizUseCase";
import { Quiz, Submission } from "../../../../domain/entities";
import { CreateUserUseCase } from "../../../../modules/user/services/createUser/createUserUseCase";
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '../../../../tests/adapters';
import { AppError } from '@/shared/errors';
import { CreateSubmissionUseCase } from '../createSubmission/createSubmissionUseCase';
import { GetSubmissionsUseCase } from './getSubmissionsUseCase';

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

        const user2 = await sutUser.execute({
            email: "flaamer1@gmail.com",
            name: "flaamer",
            password: "teste123"
        })

        const QuizRepository = new InMemoryQuizRepository();
        const QuestionRepository = new InMemoryQuestionsRepository();
        const SubmissionRepository = new InMemorySubmissionsRepository();
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

        const quiz1 = await sutQuiz.execute({
            title: "Matemática Básica",
            ownerId: user1.id,
            questions: quizQuestions,
            createdAt: new Date()
        })

        const createSubmissionAdapter = new CreateSubmissionUseCase(SubmissionRepository, usersRepository, QuizRepository, QuestionRepository)
        const submission = await createSubmissionAdapter.execute({
            userId: user2.id,
            quizId: quiz1.id,
            answers: [0, 3, 1],
        })

        const sut = new GetSubmissionsUseCase(SubmissionRepository)

        return { sut, QuizRepository, QuestionRepository, sutQuiz, user: user1, quizQuestions }
    }

    it('should return all stored quizzes', async () => {
        const { sut } = await makeSut()

        const submissions = await sut.execute()

        expect(submissions.every((submission) => submission instanceof Submission)).toBe(true);
    })

    it('should throw an error if does not have any quiz stored', async () => {
        const SubmissionRepository = new InMemorySubmissionsRepository()
        const sut = new GetSubmissionsUseCase(SubmissionRepository)
        const submission = sut.execute()

        expect(submission).rejects.not.toBeInstanceOf(Submission)
        // expect(async () => await sut.execute()).rejects.not.toEqual(expect.arrayContaining(expect.any(Quiz)));
        expect(submission).rejects.toBeInstanceOf(AppError)
    })
})