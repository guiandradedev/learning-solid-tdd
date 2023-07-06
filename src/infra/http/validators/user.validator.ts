import { body } from 'express-validator'

export const userValidationRules = () => {
    return [
        body('name').isString().isLength({min: 3}).withMessage('name'),
        body('email').isEmail().withMessage("e-mail"),
    ]
}