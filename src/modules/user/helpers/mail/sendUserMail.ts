import { IMailAdapter } from "@/modules/user/adapters";
import { authMail } from "./mails";
import { AuthMailRequest, TypePasswordResetConfirmationMail, IUserMail } from "./user-mail";

export class SendUserMail implements IUserMail {
    constructor(
        private mailAdapter: IMailAdapter
    ) { }

    async authMail({ to, code }: AuthMailRequest): Promise<void> {
        await this.mailAdapter.sendMail({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                password: process.env.MAIL_PASSWORD
            },
            body: `<h1>Your access code is ready!</h1><p>Insert the code <b>${code}</b> and enjoy!</p>`,
            from: authMail,
            subject: "Authentication Code",
            text: `Your access code is ${code}`,
            to
        })
    }

    async resetPasswordMail({ to, code }: AuthMailRequest): Promise<void> {
        await this.mailAdapter.sendMail({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                password: process.env.MAIL_PASSWORD
            },
            body: `<h1>Your reset password code is ready!</h1><p>Insert the code <b>${code}</b> and enjoy!</p>`,
            from: authMail,
            subject: "Reset Password Code",
            text: `Your reset password code is ${code}`,
            to
        })
    }

    async passwordResetConfirmationMail({ to }: TypePasswordResetConfirmationMail): Promise<void> {
        await this.mailAdapter.sendMail({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                password: process.env.MAIL_PASSWORD
            },
            body: `<h1>Your password has changed!</h1><h2>if you did not make this change, contact us at (19) 99999999</h2>`,
            from: authMail,
            subject: "Reset Password",
            text: `Your password changed!`,
            to
        })

    }
}