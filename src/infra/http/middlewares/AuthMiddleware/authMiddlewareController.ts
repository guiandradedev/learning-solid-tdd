import { NextFunction, Request, Response } from "express";
import { AppError, ErrInternalServerError, ErrTokenInvalid, ErrTokenNotProvided, ErrUserNotFound } from "../../../../shared/errors";
import { container } from "tsyringe";
import { AuthMiddlewareService } from "./authMiddlewareService";

export class AuthMiddlewareController {
    async execute(req: Request, res: Response, next: NextFunction) {
        const authToken =
            req.headers.authorization || req.body.token || req.query.token;

        if (!authToken) return res.status(ErrTokenNotProvided.status).json({ errors: [ErrTokenNotProvided] });
        const [, token] = authToken.split(" ");

        if (!token || token == 'undefined') return res.status(ErrTokenNotProvided.status).json({ errors: [ErrTokenNotProvided] });

        try {
            const authMiddlewareService = container.resolve(AuthMiddlewareService)

            const user = await authMiddlewareService.execute({token})

            if (!user) return res.status(ErrUserNotFound.status).send({ errors: [ErrUserNotFound] });

            res.locals.user = user;

            next();
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(ErrInternalServerError.status)
                    .json({ errors: [ErrInternalServerError] });
            }
            if (error instanceof AppError) {
                return res
                    .status(error.status)
                    .json({ errors: [error] });
            }
            return res
                .status(ErrInternalServerError.status)
                .json({ errors: [ErrInternalServerError] });
        }
    }
}