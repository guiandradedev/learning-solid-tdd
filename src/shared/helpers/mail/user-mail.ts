export type AuthMailRequest = {
    to: string,
    code: string | number
}

export interface UserMail {
    authMail(_options: AuthMailRequest): Promise<boolean>;
}