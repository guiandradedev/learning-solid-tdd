import { AppError } from "./AppError";

export const ErrTokenInvalid = new AppError({
    message: "Token Invalid",
    status: 401,
    title: "ErrTokenInvalid"
})