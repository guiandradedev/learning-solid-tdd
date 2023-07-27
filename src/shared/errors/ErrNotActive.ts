import { AppError } from "./AppError"

export class ErrNotActive extends AppError {
    constructor(param: string) {
        super({
            message: `${param} not active`,
            status: 401,
            title: "ErrNotActive"
        })
    }
}