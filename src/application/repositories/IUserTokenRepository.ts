import { UserToken } from "../../domain/entities/user-token";

export interface IUserTokenRepository {
    create(data: UserToken): Promise<void>;
}