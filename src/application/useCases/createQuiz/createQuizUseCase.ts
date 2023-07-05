import { Question } from "../../../domain/entities/question";
import { Quiz, QuizProps } from "../../../domain/entities/quiz";
import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { IQuizRepository } from "../../repositories/IQuizRepository";
import { QuestionProps as IQuestion } from '../../../domain/entities/question'
import { IUsersRepository } from "../../repositories/IUsersRepository";

type QuestionProps = {
    question: string,
    answers: string[]
    correctAnswer: number
}
export interface CreateQuizProps extends QuizProps {
    questions: QuestionProps[],
}

export class CreateQuizUseCase {
    constructor(
        private quizRepository: IQuizRepository,
        private questionsRepository: IQuestionRepository,
        private usersRepository: IUsersRepository
    ) { }

    async execute({ title, questions, owner }: CreateQuizProps) {
        if (questions.length == 0) throw new Error("User should add at least one question")

        for (const q of questions) {
            if (q.answers.length < 2) throw new Error('Questions should have at least two answers')
            if(q.correctAnswer > q.answers.length - 1 || q.correctAnswer < 0) throw new Error('Correct answer must be between 0 and maximum length -1')
        }

        const userExists = await this.usersRepository.findById(owner)

        if(!userExists) throw new Error('User does not exists')

        const quizBase = Quiz.create({ title, owner })

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