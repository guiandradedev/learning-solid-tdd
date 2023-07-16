import { ActivateCode } from "domain/entities/activate-code";

export interface IActivateCodeRepository {
    create(code: ActivateCode): Promise<void>
}