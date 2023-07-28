import 'dotenv/config'; //private data
import 'reflect-metadata'

import '@/shared/container'

import express from 'express'
import cors from 'cors'
import routes from './routes'

//create app
export const app = express()

//config middleware
app.use(express.json())
app.use(cors())

//rotas
app.use('/api', routes)