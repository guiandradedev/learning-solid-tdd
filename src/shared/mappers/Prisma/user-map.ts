import { User as prismaUser } from "@prisma/client"
import { User } from "../../../domain/entities/user"

const prismaUserToEntity = (u: prismaUser): User => {
    const user = User.create({
        name: u.name,
        email: u.email,
        password: u.password
    }, u.id)

    return user
}

export { prismaUserToEntity }