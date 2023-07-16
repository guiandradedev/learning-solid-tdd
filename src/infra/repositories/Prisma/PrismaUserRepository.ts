import { IUsersRepository } from "../../../application/repositories/IUsersRepository";
import { User } from "../../../domain/entities/user";
import { prismaUserToEntity } from "../../../shared/mappers/Prisma/user-map";
import { prismaClient } from "../../../shared/providers/database/prisma";

export class PrismaUserRepository implements IUsersRepository {

    async findByEmail(email: string): Promise<User | null> {
        const user = await prismaClient.user.findUnique({ where: { email } })

        if (!user) return null;

        const u = prismaUserToEntity(user)

        return u;
    }

    async create(data: User): Promise<void> {
        await prismaClient.user.create({ data: { ...data.props, id: data.id } })
    }

    async findById(id: string): Promise<User | null> {
        const user = await prismaClient.user.findUnique({ where: { id } })

        if (!user) return null;

        const u = prismaUserToEntity(user)

        return u;
    }

}