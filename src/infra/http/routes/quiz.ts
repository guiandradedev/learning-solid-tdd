import { Router } from 'express'
import { CreateQuizController } from '../../../application/useCases/quiz/createQuiz/createQuizController'
import { validateRules } from '../validators'
import { createQuizQuestionValidationRules, createQuizValidationRules, createSubmissionValidationRules } from '../validators/quiz.validator'
import { AuthMiddlewareController } from '../middlewares/AuthMiddleware/authMiddlewareController'
import { GetQuizController } from '@/application/useCases/quiz/GetQuiz/getQuizController'
import { GetQuizzesController } from '@/application/useCases/quiz/getQuizzes/getQuizzesController'
import { CreateSubmissionController } from '@/application/useCases/quiz/createSubmission/createSubmissionController'
import { GetUserSubmissionsController } from '@/application/useCases/quiz/getUserSubmissions/getUserSubmissionsController'

const routes = Router()
const authMiddlewareController = new AuthMiddlewareController()

const createQuizController = new CreateQuizController()
const getQuizController = new GetQuizController()
const getQuizzesController = new GetQuizzesController()
const createSubmissionController = new CreateSubmissionController()
const getUserSubmissionsController = new GetUserSubmissionsController()

routes.get('/submission/', authMiddlewareController.execute, (req, res)=>{res.send("incomplete")})
routes.post('/submission', authMiddlewareController.execute, createSubmissionValidationRules(), validateRules, createSubmissionController.handle)
routes.get('/submission/user/:search', authMiddlewareController.execute, getUserSubmissionsController.handle)
routes.get('/submission/:search', authMiddlewareController.execute, (req, res)=>{res.send("incomplete")})

routes.post('/', authMiddlewareController.execute, createQuizValidationRules(), createQuizQuestionValidationRules(), validateRules, createQuizController.handle)
routes.get('/', authMiddlewareController.execute, getQuizzesController.handle)
routes.get('/:search', authMiddlewareController.execute, getQuizController.handle)

export default routes;