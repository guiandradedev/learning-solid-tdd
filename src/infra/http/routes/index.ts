import { Router } from 'express'
import quiz from './quiz'
import { Auth } from '@/modules/user/infra/http/routes'

const routes = Router()

routes.get("/", (req, res) => {
    res.send("Hello API")
})

routes.use('/auth', Auth.default)
routes.use('/quiz', quiz)

export default routes;