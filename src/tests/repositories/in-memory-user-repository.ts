import { IUsersRepository } from "../../application/repositories/IUsersRepository";
import { User } from "../../domain/entities/user";

export class InMemoryUsersRepository implements IUsersRepository {
    public users: User[] = []

    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find(user => user.props.email == email)

        if(!user) return null;

        return user;
    }

    async create(data: User): Promise<void> {
        this.users.push(data)
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find(user => user.id == id)

        if(!user) return null;

        return user;
    }
}