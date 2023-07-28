import { container } from "tsyringe";

import { PrismaUserRepository } from "../../infra/repositories/Prisma/PrismaUserRepository";
// import { PrismaQuizRepository } from "../../infra/repositories/Prisma/PrismaQuizRepository";
// import { PrismaQuestionRepository } from "../../infra/repositories/Prisma/PrismaQuestionRepository";
import { PrismaUserTokenRepository } from "../../infra/repositories/Prisma/PrismaUserTokenRepository";
// import { PrismaSubmissionRepository } from "../../infra/repositories/Prisma/PrismaSubmissionRepository";

import { IUsersRepository } from "../../application/repositories/IUsersRepository";
import { IQuizRepository } from "../../application/repositories/IQuizRepository";
import { IQuestionRepository } from "../../application/repositories/IQuestionRepository";
import { IUserTokenRepository } from "../../application/repositories/IUserTokenRepository";
import { ISubmissionRepository } from "../../application/repositories/ISubmissionRepository";

import { HashAdapter, BcryptHashAdapter } from "../adapters/hash";
import { JwtSecurityAdapter, SecurityAdapter } from "../adapters/security";
import { MailAdapter } from "../adapters/mail";
import { NodemailerMailAdapter } from "../adapters/mail/NodemailerMailAdapter";
import { InMemoryQuestionsRepository, InMemoryQuizRepository, InMemorySubmissionsRepository, InMemoryUserCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository } from "@/tests/repositories";
import { IUserCodeRepository } from "@/application/repositories";
import { PrismaUserCodeRepository } from "@/infra/repositories/Prisma/PrismaUserCodeRepository";

//Repositories
container.registerSingleton<IUsersRepository>(
    "UsersRepository",
    PrismaUserRepository
)

container.registerSingleton<IQuizRepository>(
    "QuizRepository",
    InMemoryQuizRepository
)

container.registerSingleton<IQuestionRepository>(
    "QuestionRepository",
    InMemoryQuestionsRepository
)

container.registerSingleton<IUserTokenRepository>(
    "UserTokenRepository",
    PrismaUserTokenRepository
)

container.registerSingleton<ISubmissionRepository>(
    "SubmissionRepository",
    InMemorySubmissionsRepository
)

container.registerSingleton<IUserCodeRepository>(
    "UserCodeRepository",
    PrismaUserCodeRepository
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

const nodemaileradapter = new NodemailerMailAdapter()
container.registerInstance<MailAdapter>(
    "MailAdapter",
    nodemaileradapter
)