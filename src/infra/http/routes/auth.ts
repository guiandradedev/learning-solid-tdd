import { Router } from 'express'
import { CreateUserController } from '../../../application/useCases/user/createUser/CreateUserController'
import { AuthenticateUserController } from '../../../application/useCases/user/authenticateUser/authenticateUserController'
import { activateAccountValidationRules, authValidationRules, forgotPasswordValidationRules, resetPasswordValidationRules, userValidationRules } from '../validators/user.validator'
import { validateRules } from '../validators'
import { AuthMiddlewareController } from '../middlewares/AuthMiddleware/authMiddlewareController'
import { ActivateUserController } from '@/application/useCases/user/activateUser/activateUserController'
import { ForgotPasswordController } from '@/application/useCases/user/forgotPassword/forgotPasswordController'
import { ResetPasswordController } from '@/application/useCases/user/resetPassword/resetPasswordController'

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