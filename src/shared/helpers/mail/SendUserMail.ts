import { MailAdapter } from "../../../shared/adapters";
import { authMail } from "./mails";
import { AuthMailRequest, UserMail } from "./user-mail";
// import { inject, injectable } from "tsyringe";

// @injectable()
export class SendUserMail implements UserMail{
    constructor(
        // @inject('MailAdapter')
        private mailAdapter: MailAdapter
    ){}

    async authMail({to, code}:  AuthMailRequest): Promise<boolean> {
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
        return false;
    }
}