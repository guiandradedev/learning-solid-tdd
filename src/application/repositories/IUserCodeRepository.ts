import { UserCode } from "@/domain/entities/user-code";

export type FindByCodeAndUserId = {
    code: string,
    userId: string
}
export interface IUserCodeRepository {
    create(code: UserCode): Promise<void>
    findByCodeAndUserId(data: FindByCodeAndUserId): Promise<UserCode | null>
    changeCodeStatus(id: string): Promise<boolean>
}