import { ErrInvalidParam, ErrServerError } from "../../../shared/errors";
import { CreateMailConnectionRequest, MailAdapter, SendMailRequest } from "./mail";
import nodemailer, { Transporter } from 'nodemailer'

export class NodemailerMailAdapter implements MailAdapter {
    private transporter: Transporter;

    private createConnection(_options: CreateMailConnectionRequest) {
        this.transporter = nodemailer.createTransport({
            host: _options.host,
            port: Number(_options.port),
            auth: {
                user: _options.auth.user,
                pass: _options.auth.password
            }
        });
    }

    constructor(_options?: CreateMailConnectionRequest) {
        if (_options) {
            this.createConnection(_options);
        }
    }
    async sendMail(_options: SendMailRequest | SendMailRequest & CreateMailConnectionRequest): Promise<boolean> {
        if ('host' in _options) {
            this.createConnection({auth: _options.auth, host: _options.host, port: _options.port})
        } else {
            if (!this.transporter) throw new ErrInvalidParam('mail data')
        }

        try {
            await this.transporter.sendMail({
                from: _options.from,
                html: _options.body,
                subject: _options.subject,
                text: _options.text,
                to: _options.to,
            })

            return true;
        } catch (error) {
            throw new ErrServerError()
        }
    }
}