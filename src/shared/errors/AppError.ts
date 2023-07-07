import { IError } from "../../@types/error.types";

export class AppError {
    public readonly message: string;
    public readonly status: number;
    public readonly title: string;

    constructor({message, status = 400, title}: IError) {
        this.message = message;
        this.status = status;
        this.title = title;
    }
}