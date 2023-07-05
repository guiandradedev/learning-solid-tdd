import { Submission } from "../../../domain/entities/submission";
import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { IQuizRepository } from "../../repositories/IQuizRepository";
import { ISubmissionRepository } from "../../repositories/ISubmissionRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";

type CreateSubmissionRequest = {
    userId: string,
    quizId: string,
    answers: number[]
}

export class CreateSubmissionUseCase {
    constructor(
        private submissionsRepository: ISubmissionRepository,
        private usersRepository: IUsersRepository,
        private quizRepository: IQuizRepository,
        private questionsRepository: IQuestionRepository
    ) { }

    async execute({ userId, quizId, answers }: CreateSubmissionRequest) {
        const userExists = await this.usersRepository.findById(userId)
        if (!userExists) throw new Error('User does not exists')

        const quizExists = await this.quizRepository.findById(quizId)
        if (!quizExists) throw new Error('Quiz does not exists')

        if(quizExists.props.owner == userId) throw new Error('Owner cannot answer his own survey')

        const questions = await this.questionsRepository.findByQuizId(quizId)
        if(questions?.length != answers.length) throw new Error('Cannot have blank answers')

        const correctAnswers: number[] = []
        let hits = 0;

        for(const [index, question] of questions.entries()) {
            if(question.props.answers.length - 1 < answers[index]) throw new Error("Answers must be between 0 and maximum length -1")
            else {
                if(question.props.correctAnswer == answers[index]) {
                    correctAnswers.push(1)
                    hits++;
                    continue;
                }
                correctAnswers.push(0);
            }
        }

        let grade = Math.floor((hits/questions.length)*10)

        const submission = Submission.create({ quizId, answers, userId, correctAnswers, grade })

        await this.submissionsRepository.create(submission)

        return submission
    }
}