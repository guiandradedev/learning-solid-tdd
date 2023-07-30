export type AuthMailRequest = {
    to: string,
    code: string | number
}

export type TypePasswordResetConfirmationMail = {
    to: string
}

export interface IUserMail {
    authMail(_options: AuthMailRequest): Promise<void>;
    resetPasswordMail({ to, code }: AuthMailRequest): Promise<void>
    passwordResetConfirmationMail({ to }: TypePasswordResetConfirmationMail): Promise<void>
}