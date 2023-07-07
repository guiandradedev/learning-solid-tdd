import { Question } from "../../../domain/entities/question";
import { Quiz, QuizProps } from "../../../domain/entities/quiz";
import { AppError } from "../../../shared/errors/AppError";
import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { IQuizRepository } from "../../repositories/IQuizRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

type QuestionProps = {
    question: string,
    answers: string[]
    correctAnswer: number
}
export interface CreateQuizProps extends QuizProps {
    questions: QuestionProps[],
}

@injectable()
export class CreateQuizUseCase {
    constructor(
        @inject('QuizRepository')
        private quizRepository: IQuizRepository,
        @inject('QuestionRepository')
        private questionsRepository: IQuestionRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) { }

    async execute({ title, questions, ownerId, createdAt }: CreateQuizProps) {
        if (questions.length == 0) throw new AppError({title: "ERR_INVALID_QUESTIONS", message: "User should add at least one question", status: 500})

        for (const q of questions) {
            if (q.answers.length < 2) throw new AppError({title: "ERR_NUMBER_INVALID_ANSWERS", message: "Questions should have at least two answers", status: 500})
            if(q.correctAnswer > q.answers.length - 1 || q.correctAnswer < 0) throw new AppError({title: "ERR_INVALID_ANSWERS", message: "Correct answer must be between 0 and maximum length -1", status: 500})
        }

        const userExists = await this.usersRepository.findById(ownerId)

        if(!userExists) throw new AppError({title: "ERR_USER_NOT_FOUND", message: "User not found", status: 500})

        const quizBase = Quiz.create({ title, ownerId, createdAt })

        await this.quizRepository.create(quizBase)

        const qs: QuestionProps[] = []

        for (const q of questions) {
            const question = Question.create({ ...q, quizId: quizBase.id })

            await this.questionsRepository.create(question)

            qs.push(q)
        }

        const quiz = Object.assign(quizBase, { questions: qs })

        return quiz
    }
}