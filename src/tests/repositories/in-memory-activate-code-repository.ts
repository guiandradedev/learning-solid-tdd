import { IActivateCodeRepository } from "../../application/repositories";
import { ActivateCode } from "../../domain/entities";

export class InMemoryActivateCodeRepository implements IActivateCodeRepository {
    public codes: ActivateCode[] = []

    async create(data: ActivateCode): Promise<void> {
        this.codes.push(data)
    }
}
