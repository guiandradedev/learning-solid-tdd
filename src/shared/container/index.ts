import { container } from "tsyringe";


import { IQuizRepository } from "../../application/repositories/IQuizRepository";
import { IQuestionRepository } from "../../application/repositories/IQuestionRepository";
import { ISubmissionRepository } from "../../application/repositories/ISubmissionRepository";

import { IHashAdapter, BcryptHashAdapter } from "../../modules/user/adapters/hash";
import { JwtSecurityAdapter, SecurityAdapter } from "../../modules/user/adapters/security";
import { MailAdapter } from "../../modules/user/adapters/mail";
import { NodemailerMailAdapter } from "../../modules/user/adapters/mail/NodemailerMailAdapter";
import { InMemoryQuestionsRepository, InMemoryQuizRepository, InMemorySubmissionsRepository, InMemoryUserCodeRepository, InMemoryUserTokenRepository, InMemoryUsersRepository } from "@/tests/repositories";
import { PrismaUserCodeRepository } from "@/modules/user/infra/repositories/PrismaUserCodeRepository";
import { PrismaQuizRepository } from "@/infra/repositories/Prisma/PrismaQuizRepository";
import { PrismaQuestionRepository } from "@/infra/repositories/Prisma/PrismaQuestionRepository";
import { PrismaSubmissionRepository } from "@/infra/repositories/Prisma/PrismaSubmissionRepository";
import { IUserCodeRepository, IUserTokenRepository, IUsersRepository } from "@/modules/user/repositories";
import { PrismaUserRepository } from "@/modules/user/infra/repositories/PrismaUserRepository";
import { PrismaUserTokenRepository } from "@/modules/user/infra/repositories/PrismaUserTokenRepository";

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

container.registerSingleton<IUserCodeRepository>(
    "UserCodeRepository",
    PrismaUserCodeRepository
)

//Adapters
const bcryptadapter = new BcryptHashAdapter(12)
container.registerInstance<IHashAdapter>(
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