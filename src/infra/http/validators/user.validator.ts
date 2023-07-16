import { body } from 'express-validator'

export const userValidationRules = () => {
    return [
        body('name').exists().withMessage('name is invalid').isString().withMessage('name is not a string'),
        body('email').exists().withMessage('email is invalid').isEmail().withMessage("email is not a valid email"),
        body('password').exists().withMessage('password is invalid').isString().withMessage('password is not a string'),
    ]
}

export const authValidationRules = () => {
    return [
        body('email').exists().withMessage('email is invalid').isEmail().withMessage("email is not a valid email"),
        body('password').exists().withMessage('password is invalid').isString().withMessage('password is not a string'),
    ]
}