import { TypesUserCode, User, UserCode } from "@/domain/entities"
import { User as prismaUser, UserCode as prismaUserCode } from "@prisma/client"

const prismaUserToEntity = (u: prismaUser): User => {
    const user = User.create({
        name: u.name,
        email: u.email,
        password: u.password,
        active: u.active
    }, u.id)

    return user
}

const prismaUserCodeToEntity = (u: prismaUserCode): UserCode => {
    const user = UserCode.create({
        code: u.code,
        createdAt: u.createdAt,
        expiresIn: u.expiresIn,
        active: u.active,
        type: u.type as TypesUserCode,
        userId: u.userId,
    }, u.id)

    return user
}


export { prismaUserToEntity, prismaUserCodeToEntity }