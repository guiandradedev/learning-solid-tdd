import { NextFunction, Request, Response } from "express";
import { AppError, ErrInvalidParam, ErrNotFound, ErrServerError } from "../../../../shared/errors";
import { container } from "tsyringe";
import { AuthMiddlewareService } from "./authMiddlewareService";

export class AuthMiddlewareController {
    async execute(req: Request, res: Response, next: NextFunction) {
        const authToken =
            req.headers.authorization || req.body.token || req.query.token;

        if (!authToken) return res.status(new ErrInvalidParam('token').status).json({errors: [new ErrInvalidParam('token')]})
        const [, token] = authToken.split(" ");

        if (!token || token == 'undefined') return res.status(new ErrInvalidParam('token').status).json({errors: [new ErrInvalidParam('token')]})

        try {
            const authMiddlewareService = container.resolve(AuthMiddlewareService)

            const user = await authMiddlewareService.execute({token})

            if (!user) return res.status(new ErrNotFound('user').status).send({ errors: [new ErrNotFound('user')] });

            res.locals.user = user;

            next();
        } catch (error) {
            if (error instanceof AppError) {
                return res
                    .status(error.status)
                    .json({ errors: [error] });
            }
            if (error instanceof Error) {
                return res
                    .status(new ErrServerError().status)
                    .json({ errors: [new ErrServerError()] });
            }
            return res
                .status(new ErrServerError().status)
                .json({ errors: [new ErrServerError()] });
        }
    }
}