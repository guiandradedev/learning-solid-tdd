import { FindByCodeAndUserId, IActivateCodeRepository } from "../../application/repositories";
import { ActivateCode } from "../../domain/entities";

export class InMemoryActivateCodeRepository implements IActivateCodeRepository {
    public codes: ActivateCode[] = []

    async create(data: ActivateCode): Promise<void> {
        this.codes.push(data)
    }

    async findByCodeAndUserId(data: FindByCodeAndUserId): Promise<ActivateCode> {
        return ActivateCode.create({active: false, code: "", createdAt: new Date(), userId: ""})
    }
}
