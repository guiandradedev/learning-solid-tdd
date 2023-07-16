import { User } from "../../domain/entities";

export interface IUsersRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(user: User): Promise<void>
}