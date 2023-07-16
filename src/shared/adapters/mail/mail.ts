export interface SendMailRequest {
    from: string,
    to: string,
    subject: string,
    body: string,
    text: string
}

export interface CreateMailConnectionRequest {
    host: string,
    port: number,
    auth: {
        user: string,
        password: string
    }
}

export interface MailAdapter {
    sendMail(options: SendMailRequest | SendMailRequest & CreateMailConnectionRequest): Promise<boolean>;
}