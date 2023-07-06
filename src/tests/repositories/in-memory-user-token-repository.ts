import { IUserTokenRepository } from "../../application/repositories/IUserTokenRepository";
import { User } from "../../domain/entities/user";
import { UserToken } from "../../domain/entities/user-token";

export class InMemoryUserTokenRepository implements IUserTokenRepository {
    public users: User[] = []

    async create(data: UserToken): Promise<void> {
        
    }

}