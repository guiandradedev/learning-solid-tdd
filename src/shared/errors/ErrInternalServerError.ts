import { AppError } from "./AppError";

export const ErrInternalServerError = new AppError({
    message: "Internal Server Error",
    status: 500,
    title: "ErrInternalServerError"
})