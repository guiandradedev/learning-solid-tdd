import { UserCode } from "@/modules/user/domain";
import { FindByCode, FindByCodeAndUserId, FindCodeByUserId, IUserCodeRepository } from "@/modules/user/repositories";
import { prismaUserCodeToEntity } from "@/shared/mappers/Prisma/user-map";
import { prismaClient } from "@/shared/adapters/database/prisma";

export class PrismaUserCodeRepository implements IUserCodeRepository {
    async create(data: UserCode): Promise<void> {
        await prismaClient.userCode.create({ data: { ...data.props, id: data.id } })
    }

    async findByCodeAndUserId({code, userId, type}: FindByCodeAndUserId): Promise<UserCode> {
        const data = await prismaClient.userCode.findFirst({
            where: {
                code,
                userId,
                type: type ?? {contains: ''}
            }
        })
        
        if(!data) return null;

        return prismaUserCodeToEntity(data);
    }

    async findByCode({code, type}: FindByCode): Promise<UserCode> {
        const data = await prismaClient.userCode.findFirst({
            where: {
                code,
                type: type ?? {contains: ''}
            }
        })
        
        if(!data) return null;

        return prismaUserCodeToEntity(data);
    }

    async findByUserId({userId, type}: FindCodeByUserId): Promise<UserCode> {
        const data = await prismaClient.userCode.findFirst({
            where: {
                userId,
                type: type ?? {contains: ''}
            }
        })
        
        if(!data) return null;

        return prismaUserCodeToEntity(data);
    }

    async changeCodeStatus(id: string): Promise<boolean> {
        const userCode = await prismaClient.userCode.findFirst({where: {id}})
        if(!userCode) return null;

        const status = !userCode.active

        await prismaClient.userCode.update({
            where: {id},
            data: {
                active: status
            }
        })

        return status
    }
}
