import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authToken =
        req.headers.authorization || req.body.token || req.query.token;

    if (!authToken) return res.status(401).json({ errors: [new AppError({ message: "You should insert a token", status: 401 })] });
    const [, token] = authToken.split(" ");

    if (!token || token == 'undefined') return res.status(401).json({ errors: [new AppError({ message: "You should insert a token", status: 401 })] });

    //   try {
    //     const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    //     const id = payload.sub as string;
    //     const user = await prismaClient.user.findUnique({
    //       where: { id },
    //     });
    //     if (!user) return res.status(errUserTokenNotFound.status).send({ errors: [errUserTokenNotFound] });

    //     res.locals.authentication = payload;
    //     res.locals.user = user;

    //     next();
    //   } catch (error) {
    //     console.log(error);
    //     if (error instanceof Error) {
    //       if (error.message === "jwt expired" || error.message === "invalid signature") {
    //         return res
    //           .status(errTokenInvalid.status)
    //           .json({ errors: [errTokenInvalid] });
    //       } else if (error.message == "jwt must be provided") {
    //         return res
    //           .status(errNeedsToken.status)
    //           .json({ errors: [errNeedsToken] });
    //       } else {
    //         return res
    //           .status(errApplication.status)
    //           .json({ errors: [errApplication] });
    //       }
    //     } else {
    //       return res
    //         .status(errApplication.status)
    //         .json({ errors: [errApplication] });
    //     }
    //   }
};

export { authMiddleware };