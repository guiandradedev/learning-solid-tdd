import { Entity } from "../../core/domain/Entity";

export type ActivateCodeProps = {
    userId: string,
    code: string,
    active: boolean,
    createdAt: Date
}

export class ActivateCode extends Entity<ActivateCodeProps> {
    private constructor(props: ActivateCodeProps, id?: string) {
        super(props, id)
    }

    public static create(props: ActivateCodeProps, id?: string) {
        const code = new ActivateCode(props, id);

        return code;
    }
}