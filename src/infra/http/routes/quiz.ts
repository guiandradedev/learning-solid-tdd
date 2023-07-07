import { Router } from 'express'
import { CreateQuizController } from '../../../application/useCases/createQuiz/createQuizController'
import { validateRules } from '../validators'
import { quizValidationRules } from '../validators/quiz.validator'

const routes = Router()

const createQuizController = new CreateQuizController()

routes.post('/', quizValidationRules(), validateRules, createQuizController.handle)

export default routes;