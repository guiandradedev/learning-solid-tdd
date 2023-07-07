import { body } from 'express-validator'

export const quizValidationRules = () => {
    return [
        body('title').exists().withMessage('title is invalid').isString().withMessage('title is not a string'),
        body('ownerId').exists().withMessage('ownerId is invalid').isUUID().withMessage('ownerId is not a UUID'),
        body('createdAt').exists().withMessage('createdAt is invalid').isDate().withMessage('createdAt is not a date'),
    ]
}