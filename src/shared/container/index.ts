import { container } from "tsyringe";
import { PrismaQuestionRepository } from "@/modules/quiz/infra/repositories/Prisma/PrismaQuestionRepository";
import { PrismaQuizRepository } from "@/modules/quiz/infra/repositories/Prisma/PrismaQuizRepository";
import { PrismaSubmissionRepository } from "@/modules/quiz/infra/repositories/Prisma/PrismaSubmissionRepository";
import { IQuestionRepository, IQuizRepository, ISubmissionRepository } from "@/modules/quiz/repositories";
import { BcryptHashAdapter, IHashAdapter, IMailAdapter, ISecurityAdapter, JwtSecurityAdapter } from "@/modules/user/adapters";
import { NodemailerMailAdapter } from "@/modules/user/adapters/mail/NodemailerMailAdapter";
import { PrismaUserCodeRepository } from "@/modules/user/infra/repositories/Prisma/PrismaUserCodeRepository";
import { PrismaUserRepository } from "@/modules/user/infra/repositories/Prisma/PrismaUserRepository";
import { PrismaUserTokenRepository } from "@/modules/user/infra/repositories/Prisma/PrismaUserTokenRepository";
import { IUserCodeRepository, IUserTokenRepository, IUsersRepository } from "@/modules/user/repositories";

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

container.registerSingleton<ISecurityAdapter>(
    "SecurityAdapter",
    JwtSecurityAdapter
)

const nodemaileradapter = new NodemailerMailAdapter()
container.registerInstance<IMailAdapter>(
    "MailAdapter",
    nodemaileradapter
)