import { AppError } from "./AppError"

export class ErrInvalidParam extends AppError {
    constructor(message: string) {
        super({
            message: `Invalid param: ${message}`,
            status: 500,
            title: "ErrInvalidParam"
        })
    }
}