import { IError } from "../../@types/error.types";

export class AppError extends Error{
    public readonly status: number;
    public readonly title: string;

    constructor({message, status, title}: IError) {
        super()
        this.message = message
        this.status = status
        this.title = title
    }
}