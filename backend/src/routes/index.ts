import { Router, Request, Response } from 'express'
import * as express from 'express'

//Routes
import task from './task'
import auth from './auth'
import user from './user'

 const routes = Router()
 const app = express()

routes.get('/', async (req: Request, res: Response) => {
    return res.json({ message: 'Hello World' })
})

app.use('/auth', auth)
app.use('/user', user)
app.use('/task', task)

export default routes