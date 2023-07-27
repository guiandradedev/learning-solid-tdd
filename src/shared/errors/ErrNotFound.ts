import { AppError } from "./AppError"

export class ErrNotFound extends AppError {
    constructor(paramName: string) {
        super({
            message: `${paramName} not found.`,
            status: 404,
            title: "ErrNotFound"
        })
    }
}