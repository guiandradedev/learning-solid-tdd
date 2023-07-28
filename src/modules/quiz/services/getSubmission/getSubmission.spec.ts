import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { CreateQuizUseCase } from "@/modules/quiz/services/createQuiz/createQuizUseCase";
import { CreateUserUseCase } from "@/modules/user/services/createUser/createUserUseCase";
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters';
import { InMemoryUserCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository, InMemoryQuizRepository, InMemoryQuestionsRepository, InMemorySubmissionsRepository } from '@/tests/repositories';
import { AppError } from '@/shared/errors';
import { CreateSubmissionUseCase } from '@/modules/quiz/services/createSubmission/createSubmissionUseCase';
import { GetSubmissionUseCase } from './getSubmissionUseCase';
import { Submission } from '@/modules/quiz/domain';

describe("Get Submission", async () => {
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

        const sut = new GetSubmissionUseCase(SubmissionRepository)

        return { sut, QuizRepository, QuestionRepository, sutQuiz, user: user1, quizQuestions, submission }
    }
    it('should return a quiz', async () => {
        const { sut, submission } = await makeSut()

        const sub = await sut.execute({
            submissionId: submission.id
        })

        expect(sub).toBeInstanceOf(Submission)
    })
    it('should throw an error if the quiz does not exists', async () => {
        const SubmissionRepository = new InMemorySubmissionsRepository()
        const sut = new GetSubmissionUseCase(SubmissionRepository)
        const quiz = sut.execute({
            submissionId: 'fake_quiz_id'
        })
        
        expect(quiz).rejects.toBeInstanceOf(AppError)
    })
})