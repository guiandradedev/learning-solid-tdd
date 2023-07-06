import { Entity } from "../../core/domain/Entity";

type UserProps = {
    refreshToken: string,
    expiresDate: Date,
    createdAt: Date,
    userId: string
}

export class UserToken extends Entity<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id)
    }

    public static create(props: UserProps, id?: string) {
        const user = new UserToken(props, id);

        return user;
    }
}