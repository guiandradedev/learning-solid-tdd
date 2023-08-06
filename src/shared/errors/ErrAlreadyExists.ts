import { AppError } from "./AppError"

export class ErrAlreadyExists extends AppError {
    constructor(param: string) {
        super({
            message: `${param} already exists`,
            status: 500,
            title: "ErrAlreadyExists"
        })
    }
}