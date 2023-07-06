import { container } from "tsyringe";
import { IUsersRepository } from "../../application/repositories/IUsersRepository";
import { PrismaUserRepository } from "../../infra/http/repositories/Prisma/PrismaUserRepository";
import { PrismaQuizRepository } from "../../infra/http/repositories/Prisma/PrismaQuizRepository";
import { IQuizRepository } from "../../application/repositories/IQuizRepository";
import { IQuestionRepository } from "../../application/repositories/IQuestionRepository";
import { PrismaQuestionRepository } from "../../infra/http/repositories/Prisma/PrismaQuestionRepository";
import { IUserTokenRepository } from "../../application/repositories/IUserTokenRepository";
import { PrismaUserTokenRepository } from "../../infra/http/repositories/Prisma/PrismaUserTokenRepository";

container.registerSingleton<IUsersRepository>(
    "UsersRepository",
    PrismaUserRepository
)

container.registerSingleton<IQuizRepository>(
    "QuizRepository",
    PrismaQuizRepository
)

container.registerSingleton<IQuestionRepository>(
    "QuestionRepository",
    PrismaQuestionRepository
)

container.registerSingleton<IUserTokenRepository>(
    "UserTokenRepository",
    PrismaUserTokenRepository
)