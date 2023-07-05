import { Entity } from "../../core/domain/Entity";

type SubmissionProps = {
    userId: string,
    quizId: string,
    answers: number[],
    correctAnswers: number[], //binary array
    grade: number,
    createdAt?: Date
}

export class Submission extends Entity<SubmissionProps> {
    private constructor(props: SubmissionProps, id?: string) {
        super(props, id)
    }

    public static create(props: SubmissionProps, id?: string) {
        const submission = new Submission({...props, createdAt: props.createdAt ?? new Date()}, id);

        return submission;
    }
}