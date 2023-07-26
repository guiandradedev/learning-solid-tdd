import { FindByCodeAndUserId, IActivateCodeRepository } from "../../application/repositories";
import { ActivateCode } from "../../domain/entities";

export class InMemoryActivateCodeRepository implements IActivateCodeRepository {
    public codes: ActivateCode[] = []

    async create(data: ActivateCode): Promise<void> {
        this.codes.push(data)
    }

    async findByCodeAndUserId({code, userId}: FindByCodeAndUserId): Promise<ActivateCode> {
        const data = this.codes.find((c)=>c.props.code == code && c.props.userId == userId)

        if(!data) return null;

        return data;
    }

    async changeCodeStatus(id: string): Promise<boolean> {
        const data = this.codes.find(c=>c.id==id)
        if(!data) return null;
        const status = !data.props.active
        data.props.active = status
        return status;
    }
}
