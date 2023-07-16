import { container } from "tsyringe";

import { PrismaUserRepository } from "../../infra/repositories/Prisma/PrismaUserRepository";
import { PrismaQuizRepository } from "../../infra/repositories/Prisma/PrismaQuizRepository";
import { PrismaQuestionRepository } from "../../infra/repositories/Prisma/PrismaQuestionRepository";
import { PrismaUserTokenRepository } from "../../infra/repositories/Prisma/PrismaUserTokenRepository";

import { IUsersRepository } from "../../application/repositories/IUsersRepository";
import { IQuizRepository } from "../../application/repositories/IQuizRepository";
import { IQuestionRepository } from "../../application/repositories/IQuestionRepository";
import { IUserTokenRepository } from "../../application/repositories/IUserTokenRepository";
import { ISubmissionRepository } from "../../application/repositories/ISubmissionRepository";
import { PrismaSubmissionRepository } from "../../infra/repositories/Prisma/PrismaSubmissionRepository";

import { HashAdapter, BcryptHashAdapter } from "../adapters/hash";
import { JwtSecurityAdapter, SecurityAdapter } from "../adapters/security";
import { InMemoryHashAdapter } from "../../tests/adapters";

//Repositories
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

container.registerSingleton<ISubmissionRepository>(
    "SubmissionRepository",
    PrismaSubmissionRepository
)


//Adapters
const bcryptadapter = new BcryptHashAdapter(12)
container.registerInstance<HashAdapter>(
    "HashAdapter",
    bcryptadapter
)

container.registerSingleton<SecurityAdapter>(
    "SecurityAdapter",
    JwtSecurityAdapter
)