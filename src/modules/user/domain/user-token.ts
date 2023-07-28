import { Entity } from "@/shared/core/entity";

type UserTokenProps = {
    refreshToken: string,
    refreshTokenExpiresDate: Date,
    createdAt: Date,
    userId: string
}

export class UserToken extends Entity<UserTokenProps> {
    private constructor(props: UserTokenProps, id?: string) {
        super(props, id)
    }

    public static create(props: UserTokenProps, id?: string) {
        const user = new UserToken(props, id);

        return user;
    }
}