/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import 'reflect-metadata'
import { Request, Response, NextFunction } from 'express'
import AppError from './errors/AppError'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as helmet from 'helmet'
import routes from './routes/index'

// Database
import './database'

// create express app
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(routes)
app.use(helmet())

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

app.listen(3000, () => {
  console.log('🚀️ Server started on port 3000!')
})
