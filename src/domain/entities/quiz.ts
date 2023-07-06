import { Entity } from "../../core/domain/Entity";

export type QuizProps = {
    title: string,
    createdAt: Date,
    ownerId: string
}

export class Quiz extends Entity<QuizProps> {
    private constructor(props: QuizProps, id?: string) {
        super(props, id)
    }

    public static create(props: QuizProps, id?: string) {
        const quiz = new Quiz(props, id);

        return quiz;
    }
}