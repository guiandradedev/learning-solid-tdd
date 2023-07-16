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