import { AppError } from "./AppError"

export class ErrUnauthorized extends AppError {
    constructor(message?: string) {
        super({
            message: message ?? "Unauthorized",
            status: 401,
            title: "ErrUnauthorized"
        })
    }
}