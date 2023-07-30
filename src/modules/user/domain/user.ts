import { Entity } from "@/shared/core/entity";

type UserProps = {
    name: string,
    email: string,
    password: string,
    active: boolean
}

export class User extends Entity<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id)
    }

    public static create(props: UserProps, id?: string) {
        const user = new User(props, id);

        return user;
    }
}