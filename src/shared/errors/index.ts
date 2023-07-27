import { AppError } from './AppError'
import { ErrAlreadyExists } from './ErrAlreadyExists'
import { ErrInvalidParam } from './ErrInvalidParam'
import { ErrMissingParam } from './ErrMissingParam'
import { ErrNotActive } from './ErrNotActive'
import { ErrNotFound } from './ErrNotFound'
import { ErrServerError } from './ErrServerError'
import { ErrUnauthorized } from './ErrUnauthorized'

export * from './AppError'
export * from './ErrServerError'
export * from './ErrMail'
export * from './ErrMissingParam'
export * from './ErrInvalidParam'
export * from './ErrNotFound'
export * from './ErrUnauthorized'
export * from './ErrAlreadyExists'
export * from './ErrNotActive'

export const validateErrors = (error: any) => {
    if (error instanceof AppError
        || error instanceof ErrServerError
        || error instanceof ErrMissingParam
        || error instanceof ErrInvalidParam
        || error instanceof ErrNotFound
        || error instanceof ErrUnauthorized
        || error instanceof ErrAlreadyExists
        || error instanceof ErrNotActive
    ) {
        return error
    }
    return false
}