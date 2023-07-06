import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { deleteFile } from '../../../shared/utils/file'
import { IError } from '../../../@types/error.types'

export const validateRules = (req: Request, res: Response, next: NextFunction) => {
    const errorsRequest = validationResult(req)
    if (errorsRequest.isEmpty()) {
        return next()
    }

    if(req.file) {
        deleteFile(req.file.path)
    }

    const errors: IError[] = []
    errorsRequest.array().map(err => {
        errors.push({
            message: `O campo ${err.msg} é inválido`,
            status: 422
        })
    })

    return res.status(422).json({ errors: [errors] });
}