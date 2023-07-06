import { Router} from 'express'
import { CreateUserController } from '../../../application/useCases/createUser/CreateUserController'
import { CreateQuizController } from '../../../application/useCases/createQuiz/createQuizController'

const routes = Router()

routes.get("/", (req, res)=>{
    res.send("Hello API")
})

const createUserController = new CreateUserController()
const createQuizController = new CreateQuizController()

routes.post('/user', createUserController.handle)
routes.post('/quiz', createQuizController.handle)

export default routes;