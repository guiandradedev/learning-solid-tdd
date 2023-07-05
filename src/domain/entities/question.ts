import { Entity } from "../../core/domain/Entity";

export type QuestionProps = {
    quizId: string,
    question: string,
    answers: string[]
    correctAnswer: number
}

export class Question extends Entity<QuestionProps> {
    private constructor(props: QuestionProps, id?: string) {
        super(props, id)
    }

    public static create(props: QuestionProps, id?: string) {
        const question = new Question(props, id);

        return question;
    }
}