import { Router} from 'express'
import { CreateUserController } from '../../../application/useCases/createUser/CreateUserController'
import { CreateQuizController } from '../../../application/useCases/createQuiz/createQuizController'
import { AuthenticateUserController } from '../../../application/useCases/authenticateUser/authenticateUserController'

const routes = Router()

routes.get("/", (req, res)=>{
    res.send("Hello API")
})

const createUserController = new CreateUserController()
const createQuizController = new CreateQuizController()
const authenticateUserController = new AuthenticateUserController()

routes.post('/user', createUserController.handle)
routes.post('/auth', authenticateUserController.handle)
routes.post('/quiz', createQuizController.handle)

export default routes;