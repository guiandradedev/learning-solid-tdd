import { AppError } from "./AppError";

export const ErrUserNotActive = new AppError({
    message: "User not active",
    status: 422,
    title: "ErrUserNotActive"
})