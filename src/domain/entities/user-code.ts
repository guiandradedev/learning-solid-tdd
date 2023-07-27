import { Entity } from "./entity";

export type UserCodeProps = {
    userId: string,
    code: string,
    active: boolean,
    expiresIn: Date,
    createdAt: Date
}

export class UserCode extends Entity<UserCodeProps> {
    private constructor(props: UserCodeProps, id?: string) {
        super(props, id)
    }

    public static create(props: UserCodeProps, id?: string) {
        const code = new UserCode(props, id);

        return code;
    }
}