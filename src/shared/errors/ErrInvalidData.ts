import { AppError } from "./AppError";

export const ErrInvalidData = new AppError({
    message: "Invalid Data",
    status: 422,
    title: "ErrInvalidData"
})