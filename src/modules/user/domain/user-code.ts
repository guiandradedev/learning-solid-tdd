import { Entity } from "@/shared/core/entity";

export type TypesUserCode = 'ACTIVATE_ACCOUNT' | 'FORGOT_PASSWORD'

export type UserCodeProps = {
    userId: string,
    code: string,
    active: boolean,
    expiresIn: Date,
    createdAt: Date,
    type: TypesUserCode
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