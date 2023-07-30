import { AppError } from "./AppError";

export class ErrServerError extends AppError {
    constructor() {
        super({
            message: "Internal Server Error",
            status: 500,
            title: "ErrInternalServerError"
        })
    }
}
