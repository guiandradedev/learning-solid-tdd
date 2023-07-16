import { ActivateCode } from "domain/entities/activate-code";

export type FindByCodeAndUserId = {
    code: string,
    userId: string
}
export interface IActivateCodeRepository {
    create(code: ActivateCode): Promise<void>
    findByCodeAndUserId(data: FindByCodeAndUserId): Promise<ActivateCode | null>
}