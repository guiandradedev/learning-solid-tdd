import { IError } from "../../@types/error.types";

export class AppError {
    public readonly message: string;
    public readonly status: number;

    constructor({message, status = 400}: IError) {
        this.message = message;
        this.status = status;
    }
}