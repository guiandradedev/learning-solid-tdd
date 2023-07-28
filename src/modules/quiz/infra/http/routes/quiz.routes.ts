import { Router } from 'express'
import { CreateQuizController } from '@/modules/quiz/services/createQuiz/createQuizController'
import { validateRules } from '@/infra/http/validators'
import { createQuizQuestionValidationRules, createQuizValidationRules, createSubmissionValidationRules } from '@/modules/quiz/infra/http/middlewares/validator/quiz.validator'
import { AuthMiddlewareController } from '@/modules/user/infra/http/middlewares/AuthMiddleware/authMiddlewareController'
import { GetQuizController } from '@/modules/quiz/services/GetQuiz/getQuizController'
import { GetQuizzesController } from '@/modules/quiz/services/getQuizzes/getQuizzesController'
import { CreateSubmissionController } from '@/modules/quiz/services/createSubmission/createSubmissionController'
import { GetUserSubmissionsController } from '@/modules/quiz/services/getUserSubmissions/getUserSubmissionsController'
import { GetSubmissionController } from '@/modules/quiz/services/getSubmission/getSubmissionController'
import { GetSubmissionsController } from '@/modules/quiz/services/getSubmissions/getSubmissionsController'

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