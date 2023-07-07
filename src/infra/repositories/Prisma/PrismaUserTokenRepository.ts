import { IUserTokenRepository } from "../../../application/repositories/IUserTokenRepository";
import { UserToken } from "../../../domain/entities/user-token";


export class PrismaUserTokenRepository implements IUserTokenRepository {
    async create(data: UserToken): Promise<void> {
        
    }
}