import { User } from "../../domain/entities";

export type TypeChangeUserPassword = {
    userId: string,
    password: string
}

export interface IUsersRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(user: User): Promise<void>
    changeStatus(id: string): Promise<boolean>;
    changePassword(data: TypeChangeUserPassword): Promise<User>;
}