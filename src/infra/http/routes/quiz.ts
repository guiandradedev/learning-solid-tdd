import { Router } from 'express'
import { CreateQuizController } from '../../../application/useCases/quiz/createQuiz/createQuizController'
import { validateRules } from '../validators'
import { createQuizQuestionValidationRules, createQuizValidationRules, createSubmissionValidationRules } from '../validators/quiz.validator'
import { AuthMiddlewareController } from '../../../modules/user/infra/http/middlewares/AuthMiddleware/authMiddlewareController'
import { GetQuizController } from '@/application/useCases/quiz/GetQuiz/getQuizController'
import { GetQuizzesController } from '@/application/useCases/quiz/getQuizzes/getQuizzesController'
import { CreateSubmissionController } from '@/application/useCases/quiz/createSubmission/createSubmissionController'
import { GetUserSubmissionsController } from '@/application/useCases/quiz/getUserSubmissions/getUserSubmissionsController'
import { GetSubmissionController } from '@/application/useCases/quiz/getSubmission/getSubmissionController'
import { GetSubmissionsController } from '@/application/useCases/quiz/getSubmissions/getSubmissionsController'

const routes = Router()
const authMiddlewareController = new AuthMiddlewareController()

const createQuizController = new CreateQuizController()
const getQuizController = new GetQuizController()
const getQuizzesController = new GetQuizzesController()
const createSubmissionController = new CreateSubmissionController()
const getUserSubmissionsController = new GetUserSubmissionsController()
const getSubmissionController = new GetSubmissionController()
const getSubmissionsController = new GetSubmissionsController()

routes.get('/submission/', authMiddlewareController.execute, getSubmissionsController.handle)
routes.post('/submission', authMiddlewareController.execute, createSubmissionValidationRules(), validateRules, createSubmissionController.handle)
routes.get('/submission/user/:search', authMiddlewareController.execute, getUserSubmissionsController.handle)
routes.get('/submission/:search', authMiddlewareController.execute, getSubmissionController.handle)

routes.post('/', authMiddlewareController.execute, createQuizValidationRules(), createQuizQuestionValidationRules(), validateRules, createQuizController.handle)
routes.get('/', authMiddlewareController.execute, getQuizzesController.handle)
routes.get('/:search', authMiddlewareController.execute, getQuizController.handle)

export default routes;