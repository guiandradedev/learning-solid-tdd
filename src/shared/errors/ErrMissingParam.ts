import { AppError } from "./AppError"

export class ErrMissingParam extends AppError {
    constructor(paramName: string) {
        super({
            message: `Missing param: ${paramName}`,
            status: 500,
            title: "ErrMissingParam"
        })
    }
}