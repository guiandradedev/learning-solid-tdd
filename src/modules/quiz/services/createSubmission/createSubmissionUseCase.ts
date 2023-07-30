import { ErrInvalidParam, ErrNotFound, ErrUnauthorized } from "@/shared/errors";
import { Submission } from "@/modules/quiz/domain";
import { inject, injectable } from "tsyringe";
import { IQuestionRepository, IQuizRepository, ISubmissionRepository } from "@/modules/quiz/repositories";
import { IUsersRepository } from "@/modules/user/repositories";

export type CreateSubmissionRequest = {
    userId: string,
    quizId: string,
    answers: number[],
    createdAt?: Date
}

@injectable()
export class CreateSubmissionUseCase {
    constructor(
        @inject('SubmissionRepository')
        private submissionsRepository: ISubmissionRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('QuizRepository')
        private quizRepository: IQuizRepository,
        @inject('QuestionRepository')
        private questionsRepository: IQuestionRepository
    ) { }

    async execute({ userId, quizId, answers, createdAt }: CreateSubmissionRequest) {
        const userExists = await this.usersRepository.findById(userId)
        if (!userExists) throw new ErrNotFound('user')

        const quizExists = await this.quizRepository.findById(quizId)
        if (!quizExists) throw new ErrNotFound('quiz')

        if (quizExists.props.ownerId == userId) throw new ErrUnauthorized('Owner cannot answer his own survey')

        const questions = await this.questionsRepository.findByQuizId(quizId)
        if (questions?.length != answers.length) throw new ErrInvalidParam('Cannot have blank answers')

        const correctAnswers: boolean[] = []
        let hits = 0;

        for (const [index, question] of questions.entries()) {
            if (question.props.answers.length - 1 < answers[index]) throw new ErrInvalidParam('Answers must be between 0 and maximum length -1')
            else {
                if (question.props.correctAnswer == answers[index]) {
                    correctAnswers.push(true)
                    hits++;
                    continue;
                }
                correctAnswers.push(false);
            }
        }

        let grade = Math.floor((hits / questions.length) * 10)

        const submission = Submission.create({ quizId, answers, userId, correctAnswers, grade, createdAt: createdAt ?? new Date() })

        await this.submissionsRepository.create(submission)

        return submission
    }
}