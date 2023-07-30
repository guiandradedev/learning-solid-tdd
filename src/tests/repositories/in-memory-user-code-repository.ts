import { IUserCodeRepository, FindByCode, FindByCodeAndUserId, FindCodeByUserId } from "@/modules/user/repositories";
import { UserCode } from "@/modules/user/domain";

export class InMemoryUserCodeRepository implements IUserCodeRepository {
    public codes: UserCode[] = []

    async create(data: UserCode): Promise<void> {
        this.codes.push(data)
    }

    async findByCodeAndUserId({code, userId, type}: FindByCodeAndUserId): Promise<UserCode> {
        const data = this.codes.find((c)=>{
            const isTypeMatch = type ? c.props.type === type : true;
            return c.props.code == code && c.props.userId == userId && isTypeMatch
        })

        if(!data) return null;

        return data;
    }

    async findByCode({code, type}: FindByCode): Promise<UserCode> {
        const data = this.codes.find((c)=>{
            const isTypeMatch = type ? c.props.type === type : true;
            return c.props.code == code && isTypeMatch
        })

        if(!data) return null;

        return data;
    }

    async findByUserId({userId, type}: FindCodeByUserId): Promise<UserCode> {
        const data = this.codes.find((c)=>{
            const isTypeMatch = type ? c.props.type === type : true;
            return c.props.userId == userId && isTypeMatch
        })

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
