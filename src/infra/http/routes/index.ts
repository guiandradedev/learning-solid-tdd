import { Router } from 'express'
import auth from './auth'
import quiz from './quiz'

const routes = Router()

routes.get("/", (req, res) => {
    res.send("Hello API")
})

routes.use('/auth', auth)
routes.use('/quiz', quiz)

export default routes;