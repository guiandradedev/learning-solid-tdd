import { prismaClient } from "@/shared/adapters/database/prisma";
import { UserToken } from "@/modules/user/domain";
import { IUserTokenRepository } from "@/modules/user/repositories";


export class PrismaUserTokenRepository implements IUserTokenRepository {
    async create(data: UserToken): Promise<void> {
        await prismaClient.userToken.create({ data: { ...data.props, id: data.id } })
    }
}