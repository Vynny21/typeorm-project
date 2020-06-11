import { Router, Request, Response } from 'express'
import * as express from 'express'

//Routes
import task from './task.routes'
import auth from './auth.routes'
import user from './user.routes'
import profile from './profile.routes'

 const routes = Router()

routes.get('/', async (req: Request, res: Response) => {
    return res.json({ message: 'Hello World' })
})

routes.use('/auth', auth)
routes.use('/user', user)
routes.use('/task', task)
routes.use('/profile', profile)

export default routes