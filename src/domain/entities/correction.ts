import { Entity } from "../../core/domain/Entity";
import { QuestionProps } from "./question";

type CorrectionProps = {
    grade: number,
    submissionId: string,
    createdAd: Date
}

export class Correction extends Entity<CorrectionProps> {
    private constructor(props: CorrectionProps, id?: string) {
        super(props, id)
    }

    public static create(props: CorrectionProps, id?: string) {
        const correction = new Correction(props, id);

        return correction;
    }
}