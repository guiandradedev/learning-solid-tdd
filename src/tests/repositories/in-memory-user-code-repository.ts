import { FindByCodeAndUserId, IUserCodeRepository } from "../../application/repositories";
import { UserCode } from "../../domain/entities";

export class InMemoryUserCodeRepository implements IUserCodeRepository {
    public codes: UserCode[] = []

    async create(data: UserCode): Promise<void> {
        this.codes.push(data)
    }

    async findByCodeAndUserId({code, userId}: FindByCodeAndUserId): Promise<UserCode> {
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
