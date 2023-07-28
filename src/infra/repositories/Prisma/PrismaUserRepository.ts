import { IUsersRepository, TypeChangeUserPassword } from "../../../application/repositories/IUsersRepository";
import { User } from "../../../domain/entities/user";
import { prismaUserToEntity } from "../../../shared/mappers/Prisma/user-map";
import { prismaClient } from "../../../shared/providers/database/prisma";

export class PrismaUserRepository implements IUsersRepository {

    async findByEmail(email: string): Promise<User | null> {
        const user = await prismaClient.user.findUnique({ where: { email } })

        if (!user) return null;

        return prismaUserToEntity(user);
    }

    async create(data: User): Promise<void> {
        await prismaClient.user.create({ data: { ...data.props, id: data.id } })
    }

    async findById(id: string): Promise<User | null> {
        const user = await prismaClient.user.findUnique({ where: { id } })

        if (!user) return null;

        return prismaUserToEntity(user);
    }

    async changeStatus(id: string): Promise<boolean> {
        const user = await this.findById(id)
        if(!user) return null;

        const status = !user.props.active

        await prismaClient.user.update({
            where: {id},
            data: {
                active: status
            }
        })

        return status
    }

    async changePassword({password, userId}: TypeChangeUserPassword): Promise<User> {
        const user = await this.findById(userId)
        if(!user) return null;

        const u = await prismaClient.user.update({
            where: {id: userId},
            data: {
                password
            }
        })

        return prismaUserToEntity(u);
    }

}