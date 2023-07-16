import { UserToken } from "../../domain/entities";

export interface IUserTokenRepository {
    create(data: UserToken): Promise<void>;
}