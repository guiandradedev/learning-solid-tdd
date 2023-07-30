import { body } from 'express-validator'

export const createQuizValidationRules = () => {
    return [
        body('title').exists().withMessage('title is invalid').isString().withMessage('title is not a string'),
        body('createdAt').optional().isDate().withMessage('createdAt is not a date'),
    ]
}

export const createQuizQuestionValidationRules = () => {
    return [
        body('questions').exists().withMessage('O campo questions não existe!').isArray().withMessage('questions is not an array').not().isEmpty().withMessage("questions can not be empty"),
        body('questions.*').exists().withMessage("O objeto questions.* não existe!").isObject().withMessage("O campo questions.* não é um objeto!"),
        body('questions.*.question').exists().withMessage("O campo questions.*.question não existe!").isString().withMessage("O campo questions.*.question não é uma string!"),
        body('questions.*.correctAnswer').exists().withMessage("O campo questions.*.correctAnswer não existe!").isInt().withMessage("O campo questions.*.correctAnswer não é um número"),
        body('questions.*.answers').exists().withMessage("O campo questions.*.answers não existe!").isArray().withMessage("O campo questions.*.answers não é um array"),
        body('questions.*.answers.*').exists().withMessage("O campo questions.*.answers.* não existe!").isString().withMessage("O campo questions.*.answers.* não é uma string")
    ]
}

export const createSubmissionValidationRules = () => {
    return [
        body('quizId').exists().withMessage('quizId does not exists').isUUID().withMessage('quizId is not an UUID'),
        body('answers').exists().withMessage('answers does not exists').isArray().withMessage('answers is not an array').not().isEmpty().withMessage("answers can not be empty"),
        body('answers.*').exists().withMessage("answers.* does not exists").isInt().withMessage("answers.* is not an integer!"),
    ]
}