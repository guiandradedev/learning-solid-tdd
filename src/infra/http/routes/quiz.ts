import { Router } from 'express'
import { CreateQuizController } from '../../../application/useCases/quiz/createQuiz/createQuizController'
import { validateRules } from '../validators'
import { createQuizQuestionValidationRules, createQuizValidationRules } from '../validators/quiz.validator'
import { AuthMiddlewareController } from '../middlewares/AuthMiddleware/authMiddlewareController'
import { GetQuizController } from '@/application/useCases/quiz/GetQuiz/getQuizController'
import { GetQuizzesController } from '@/application/useCases/quiz/getQuizzes/getQuizzesController'

const routes = Router()
const authMiddlewareController = new AuthMiddlewareController()

const createQuizController = new CreateQuizController()
const getQuizController = new GetQuizController()
const getQuizzesController = new GetQuizzesController()

routes.post('/', authMiddlewareController.execute, createQuizValidationRules(), createQuizQuestionValidationRules(), validateRules, createQuizController.handle)
routes.get('/', authMiddlewareController.execute, getQuizzesController.handle)
routes.get('/:search', authMiddlewareController.execute, getQuizController.handle)

export default routes;