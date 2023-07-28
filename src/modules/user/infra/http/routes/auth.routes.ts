import { Router } from 'express'
import { CreateUserController } from '@/modules/user/services/createUser/CreateUserController'
import { AuthenticateUserController } from '@/modules/user/services/authenticateUser/authenticateUserController'
import { activateAccountValidationRules, authValidationRules, forgotPasswordValidationRules, resetPasswordValidationRules, userValidationRules } from '../middlewares/validator/user.validator'
import { validateRules } from '@/infra/http/validators'
// import { AuthMiddlewareController } from '../middlewares/AuthMiddleware/authMiddlewareController'
import { ActivateUserController } from '@/modules/user/services/activateUser/activateUserController'
import { ForgotPasswordController } from '@/modules/user/services/forgotPassword/forgotPasswordController'
import { ResetPasswordController } from '@/modules/user/services/resetPassword/resetPasswordController'

const routes = Router()

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()
// const authMiddlewareController = new AuthMiddlewareController()
const activateUserController = new ActivateUserController()
const forgotPasswordUseCase = new ForgotPasswordController()
const resetPasswordController = new ResetPasswordController()

routes.post('/', userValidationRules(), validateRules, createUserController.handle)
routes.post('/login', authValidationRules(), validateRules, authenticateUserController.handle)
routes.post('/activate', activateAccountValidationRules(), validateRules, activateUserController.handle)
routes.post('/forgot-password', forgotPasswordValidationRules(), validateRules, forgotPasswordUseCase.handle)
routes.post('/reset-password', resetPasswordValidationRules(), validateRules, resetPasswordController.handle)

export default routes;