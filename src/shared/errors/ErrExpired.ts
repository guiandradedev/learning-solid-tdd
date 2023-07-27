import { AppError } from "./AppError"

export class ErrExpired extends AppError {
    constructor(param: string) {
        super({
            message: `${param} expired.`,
            status: 500,
            title: "ErrExpired"
        })
    }
}