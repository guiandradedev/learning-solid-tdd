import { IUserTokenRepository } from "../../application/repositories/IUserTokenRepository";
import { UserToken } from "../../domain/entities/user-token";

export class InMemoryUserTokenRepository implements IUserTokenRepository {
    public tokens: UserToken[] = []

    async create(data: UserToken): Promise<void> {
        this.tokens.push(data)
    }

}