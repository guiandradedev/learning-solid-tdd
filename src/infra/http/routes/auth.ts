import { Router } from 'express'
import { CreateUserController } from '../../../application/useCases/user/createUser/CreateUserController'
import { AuthenticateUserController } from '../../../application/useCases/user/authenticateUser/authenticateUserController'
import { authValidationRules, userValidationRules } from '../validators/user.validator'
import { validateRules } from '../validators'
import { AuthMiddlewareController } from '../middlewares/AuthMiddleware/authMiddlewareController'

const routes = Router()

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()
const authMiddlewareController = new AuthMiddlewareController()

routes.post('/', userValidationRules(), validateRules, createUserController.handle)
routes.post('/login', authValidationRules(), validateRules, authenticateUserController.handle)
routes.post('/forgot-password', authMiddlewareController.execute, (req, res)=>{res.send("Incomplete")})

export default routes;