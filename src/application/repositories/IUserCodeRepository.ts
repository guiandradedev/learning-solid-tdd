import { TypesUserCode, UserCode } from "@/domain/entities/user-code";

export type FindByCodeAndUserId = {
    code: string,
    userId: string,
    type: TypesUserCode
}

export type FindByCode = {
    code: string,
    type: TypesUserCode
}
export interface IUserCodeRepository {
    create(code: UserCode): Promise<void>
    findByCodeAndUserId(data: FindByCodeAndUserId): Promise<UserCode | null>
    findByCode(data: FindByCode): Promise<UserCode | null>
    changeCodeStatus(id: string): Promise<boolean>
}