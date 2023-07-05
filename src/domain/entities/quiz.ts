import { Entity } from "../../core/domain/Entity";
import { QuestionProps } from "./question";

export type QuizProps = {
    title: string,
    createdAt?: Date,
    owner: string
}

export class Quiz extends Entity<QuizProps> {
    private constructor(props: QuizProps, id?: string) {
        super(props, id)
    }

    public static create(props: QuizProps, id?: string) {
        const quiz = new Quiz({...props, createdAt: props.createdAt ?? new Date()}, id);

        return quiz;
    }
}