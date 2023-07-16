import { Submission } from "../../../../domain/entities/submission";
import { AppError } from "../../../../shared/errors/AppError";
import { IQuestionRepository } from "../../../repositories/IQuestionRepository";
import { IQuizRepository } from "../../../repositories/IQuizRepository";
import { ISubmissionRepository } from "../../../repositories/ISubmissionRepository";
import { IUsersRepository } from "../../../repositories/IUsersRepository";

type CreateSubmissionRequest = {
    userId: string,
    quizId: string,
    answers: number[],
    createdAt?: Date
}

export class CreateSubmissionUseCase {
    constructor(
        private submissionsRepository: ISubmissionRepository,
        private usersRepository: IUsersRepository,
        private quizRepository: IQuizRepository,
        private questionsRepository: IQuestionRepository
    ) { }

    async execute({ userId, quizId, answers, createdAt }: CreateSubmissionRequest) {
        const userExists = await this.usersRepository.findById(userId)
        if (!userExists) throw new AppError({title: "ERR_USER_NOT_FOUND", message: "User not found", status: 500})

        const quizExists = await this.quizRepository.findById(quizId)
        if (!quizExists) throw new AppError({title: "ERR_QUIZ_NOT_FOUND", message: "Quiz not found", status: 500})

        if(quizExists.props.ownerId == userId) throw new AppError({title: "ERR_OWNER_CANNOT_ANSWER", message: "Owner cannot answer his own survey", status: 500})

        const questions = await this.questionsRepository.findByQuizId(quizId)
        if(questions?.length != answers.length) throw new AppError({title: "ERR_BLANK_ANSWER", message: "Cannot have blank answers", status: 500})

        const correctAnswers: boolean[] = []
        let hits = 0;

        for(const [index, question] of questions.entries()) {
            if(question.props.answers.length - 1 < answers[index]) throw new AppError({title: "ERR_INVALID_USER_ANSWER", message: "Answers must be between 0 and maximum length -1", status: 500})
            else {
                if(question.props.correctAnswer == answers[index]) {
                    correctAnswers.push(true)
                    hits++;
                    continue;
                }
                correctAnswers.push(false);
            }
        }

        let grade = Math.floor((hits/questions.length)*10)

        const submission = Submission.create({ quizId, answers, userId, correctAnswers, grade, createdAt: createdAt ?? new Date()})

        await this.submissionsRepository.create(submission)

        return submission
    }
}