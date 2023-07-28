import { Entity } from "@/shared/core/entity";

export type SubmissionProps = {
    userId: string,
    quizId: string,
    answers: number[],
    correctAnswers: boolean[], //binary array
    grade: number,
    createdAt: Date
}

export class Submission extends Entity<SubmissionProps> {
    private constructor(props: SubmissionProps, id?: string) {
        super(props, id)
    }

    public static create(props: SubmissionProps, id?: string) {
        const submission = new Submission(props, id);

        return submission;
    }
}