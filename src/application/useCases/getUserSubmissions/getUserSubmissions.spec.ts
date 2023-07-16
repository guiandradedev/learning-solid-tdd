import 'dotenv/config'
import 'reflect-metadata'

import { describe, expect, expectTypeOf, it } from "vitest";
import { InMemorySubmissionsRepository, InMemoryUsersRepository,    InMemoryQuizRepository,    InMemoryQuestionsRepository,    InMemoryUserTokenRepository } from "../../../tests/repositories";
import { CreateSubmissionUseCase } from "../createSubmission/createSubmissionUseCase";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { CreateQuizUseCase } from "../createQuiz/createQuizUseCase";
import { GetUserSubmissionsUseCase } from "./getUserSubmissionsUseCase";
import { User, Submission, SubmissionProps } from "../../../domain/entities";
import { AppError } from '../../../shared/errors';
import { InMemoryHashAdapter, InMemorySecurityAdapter } from '../../../tests/adapters';

/*
 * Regras de Négocios
 * - Retornar as submissoes do usuário
 * - Deve trazer um erro caso o usuário não exista
 * - Deve trazer um erro caso o usúario não tenha feito testes
 * 
 */

describe("Get user submissions", () => {

    it('', ()=>{})

    type returnSut = {
        sut: GetUserSubmissionsUseCase,
        SubmissionsInMemoryRepository: InMemorySubmissionsRepository,
        user: User[],
    }

    const makeSut = async (): Promise<returnSut> => {
        const usersRepository = new InMemoryUsersRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const hashAdapter = new InMemoryHashAdapter(12);
        const securityAdapter = new InMemorySecurityAdapter()
        const sutUser = new CreateUserUseCase(usersRepository, userTokenRepository, hashAdapter, securityAdapter)

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

        const SubmissionsInMemoryRepository = new InMemorySubmissionsRepository()
        const createSubmission = new CreateSubmissionUseCase(SubmissionsInMemoryRepository, usersRepository, QuizRepository, QuestionRepository)

        await createSubmission.execute({
            userId: user2.id,
            quizId: quiz.id,
            answers: [0, 3, 1]
        })
        const sut = new GetUserSubmissionsUseCase(SubmissionsInMemoryRepository, usersRepository)

        return { sut, SubmissionsInMemoryRepository, user: [user1, user2] }
    }

    it('should return user grades', async () => {
        const { sut, user } = await makeSut()

        const submissions = await sut.execute({
            userId: user[1].id
        })

        expect(submissions.every((submission) => submission instanceof Submission)).toBe(true);
    })

    it('should throw an error if user does not exists', async () => {
        const { sut } = await makeSut()

        const dataObj = {
            userId: 'fake_user_id'
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Submission)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_USER_NOT_FOUND"
            })
        );
    })

    it('should throw an error (user does not submit and test)', async () => {
        const { sut, user } = await makeSut()

        const dataObj = {
            userId: user[0].id
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(Submission)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(AppError)
        expect(async () => await sut.execute(dataObj)).rejects.toThrow(
            expect.objectContaining({
                title: "ERR_SUBMISSION_NOT_FOUND"
            })
        );
    })
})