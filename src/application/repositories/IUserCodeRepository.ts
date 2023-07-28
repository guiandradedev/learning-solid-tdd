import { TypesUserCode, UserCode } from "modules/user/domain/user-code";

export type FindByCodeAndUserId = {
    code: string,
    userId: string,
    type?: TypesUserCode
}

export type FindByCode = {
    code: string,
    type?: TypesUserCode
}

export type FindCodeByUserId = {
    userId: string,
    type?: TypesUserCode
}
export interface IUserCodeRepository {
    create(code: UserCode): Promise<void>
    findByCodeAndUserId(data: FindByCodeAndUserId): Promise<UserCode>
    findByCode(data: FindByCode): Promise<UserCode>
    findByUserId(data: FindCodeByUserId): Promise<UserCode>
    changeCodeStatus(id: string): Promise<boolean>
}