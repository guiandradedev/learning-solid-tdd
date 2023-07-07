import { Router } from 'express'
import { CreateUserController } from '../../../application/useCases/createUser/CreateUserController'
import { AuthenticateUserController } from '../../../application/useCases/authenticateUser/authenticateUserController'
import { authValidationRules, userValidationRules } from '../validators/user.validator'
import { validateRules } from '../validators'

const routes = Router()

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()

routes.post('/', userValidationRules(), validateRules, createUserController.handle)
routes.post('/login', authValidationRules(), validateRules, authenticateUserController.handle)
routes.post('/forgot-password', (req, res)=>{res.send("Incomplete")})

export default routes;