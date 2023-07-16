import { ErrInvalidData, ErrSendMail } from "../../shared/errors";
import { CreateMailConnectionRequest, MailAdapter, SendMailRequest } from "../../shared/adapters/mail";
import nodemailermock from 'nodemailer-mock'
import { Transporter } from "nodemailer";

export class InMemoryMailAdapter implements MailAdapter {
    async sendMail(_options: SendMailRequest | SendMailRequest & CreateMailConnectionRequest): Promise<boolean> {
        return true 
    }
}