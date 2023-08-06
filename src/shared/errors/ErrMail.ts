import { AppError } from "./AppError";

export const ErrSendMail = new AppError({
    message: "An error occur while send an email",
    status: 422,
    title: "ErrSendMail"
})