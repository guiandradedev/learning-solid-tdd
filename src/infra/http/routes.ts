import { Router } from 'express'
import { Auth } from '@/modules/user/infra/http/routes'
import { Quiz } from '@/modules/quiz/infra/http/routes'

const routes = Router()

routes.get("/", (req, res) => {
    res.send("Hello API")
})

routes.use('/auth', Auth.default)
routes.use('/quiz', Quiz.default)

export default routes;