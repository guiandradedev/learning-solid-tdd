import { describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "../../../tests/repositories/in-memory-user-repository";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { InMemoryQuizRepository } from "../../../tests/repositories/in-memory-quiz-repository";
import { CreateQuizUseCase } from "../createQuiz/createQuizUseCase";
import { InMemoryQuestionsRepository } from "../../../tests/repositories/in-memory-question-repository";
import { Submission } from "../../../domain/entities/submission";
import { InMemorySubmissionsRepository } from "../../../tests/repositories/in-memory-submission-repository";
import { CreateSubmissionUseCase } from "./createSubmissionUseCase";

describe("Create Submission", async () => {
    /*
     * Regras de Negócio:
     * - O quiz deve existir ✓
     * - O usuario deve existir ✓
     * - O owner Id não pode responder ao quiz ✓
     * - Não podem haver respostas em branco ✓
     * - A resposta deve ser entre 0 e o maximo de respostas -1 ✓
     */

    const usersRepository = new InMemoryUsersRepository();
    const sutUser = new CreateUserUseCase(usersRepository)

    const user1 = await sutUser.execute({
        email: "flaamer@gmail.com",
        name: "flaamer"
    })

    const user2 = await sutUser.execute({
        email: "flaamer1@gmail.com",
        name: "flaamer"
    })

    const QuizRepository = new InMemoryQuizRepository();
    const QuestionRepository = new InMemoryQuestionsRepository();
    const sutQuiz = new CreateQuizUseCase(QuizRepository, QuestionRepository, usersRepository)

    const quiz1 = await sutQuiz.execute({
        title: "Matemática Básica",
        owner: user1.id,
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
            answers: [1, 1, 1]
        })

        expect(submission).toBeInstanceOf(Submission)
    })

    it('should throw an error (quiz does not exists)', async () => {
        const { sut } = makeSut()

        expect(async () => sut.execute({
            userId: user2.id,
            quizId: "fake_quiz_id",
            answers: [0, 1, 2]
        })).rejects.toThrowError("Quiz does not exists")
    })

    it('should throw an error (user does not exists)', async () => {
        const { sut } = makeSut()

        expect(async () => sut.execute({
            userId: "fake_user_id",
            quizId: quiz1.id,
            answers: [0, 1, 2]
        })).rejects.toThrowError("User does not exists")
    })

    it('should throw an error (owner cannot answer his own survey)', async () => {
        const { sut } = makeSut()

        expect(async () => sut.execute({
            userId: user1.id,
            quizId: quiz1.id,
            answers: [0, 1, 2]
        })).rejects.toThrowError("Owner cannot answer his own survey")
    })

    it('should throw an error if it has a blank answer', async () => {
        const { sut } = makeSut()

        expect(async () => sut.execute({
            userId: user2.id,
            quizId: quiz1.id,
            answers: [0, 1]
        })).rejects.toThrowError("Cannot have blank answers")
    })

    it('should throw an error if any answer is greater than question.length or less than 0', async () => {
        const { sut } = makeSut()

        expect(async () => sut.execute({
            userId: user2.id,
            quizId: quiz1.id,
            answers: [0, 5, 2]
        })).rejects.toThrowError("Answers must be between 0 and maximum length -1")
    })
})