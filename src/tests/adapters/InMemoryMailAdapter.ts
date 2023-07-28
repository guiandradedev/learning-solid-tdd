import { CreateMailConnectionRequest, IMailAdapter, SendMailRequest } from "../../modules/user/adapters/mail";

export class InMemoryMailAdapter implements IMailAdapter {
    async sendMail(_options: SendMailRequest | SendMailRequest & CreateMailConnectionRequest): Promise<boolean> {
        return true 
    }
}