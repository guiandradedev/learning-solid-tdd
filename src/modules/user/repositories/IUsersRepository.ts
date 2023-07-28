import { User } from "@/modules/user/domain";

export type TypeChangeUserPassword = {
    userId: string,
    password: string
}

export interface IUsersRepository {
    findByEmail(email: string): Promise<User>;
    findById(id: string): Promise<User>;
    create(user: User): Promise<void>
    changeStatus(id: string): Promise<boolean>;
    changePassword(data: TypeChangeUserPassword): Promise<User>;
}