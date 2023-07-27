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

export const activateAccountValidationRules = () => {
    return [
        body('code').exists().withMessage('code is invalid').isString().withMessage("code is not a string"),
        body('userId').exists().withMessage('userId is invalid').isUUID().withMessage('userId is not a UUID'),
    ]
}

export const forgotPasswordValidationRules = () => {
    return [
        body('email').exists().withMessage('email is invalid').isEmail().withMessage("email is not a string"),
    ]
}

export const resetPasswordValidationRules = () => {
    return [
        body('code').exists().withMessage('code is invalid').isString().withMessage("code is not a string"),
        body('password').exists().withMessage('password is invalid').isString().withMessage("password is not a string"),
        body('confirmPassword').exists().withMessage('confirmPassword is invalid').isString().withMessage("confirmPassword is not a string"),
    ]
}