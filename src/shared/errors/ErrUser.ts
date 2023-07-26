import { AppError } from "./AppError";

export const ErrUserNotFound = new AppError({
    message: "User not found",
    status: 422,
    title: "ErrUserNotFound"
})

export const ErrUserNotActive = new AppError({
    message: "User not active",
    status: 422,
    title: "ErrUserNotActive"
})

export const ErrCodeInvalid = new AppError({
    message: "Code is invalid",
    status: 422,
    title: "ErrCodeInvalid"
})

export const ErrCodeExpired = new AppError({
    message: "Your code expired, try again with your new code sent in your email!",
    status: 401,
    title: "ErrCodeExpired"
})