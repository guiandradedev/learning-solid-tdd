import { AppError } from "./AppError";

export const ErrTokenInvalid = new AppError({
    message: "Token Invalid",
    status: 401,
    title: "ErrTokenInvalid"
})

export const ErrTokenNotProvided = new AppError({
    message: "Token not provided!",
    status: 401,
    title: "ErrTokenNotProvided"
})