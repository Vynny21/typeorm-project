import { Router, Request, Response } from 'express'
import { 
    getTasks, 
    getTask, 
    saveTask, 
    updateTask, 
    finishedTask, 
    removeTask 
} from './controller/TasksController'

 const routes = Router()

routes.get('/', async (req: Request, res: Response) => {
    return res.json({ message: 'Hello World' })
})

routes.get('/tasks', getTasks)
routes.get('/tasks/:id', getTask)
routes.post('/tasks', saveTask)
routes.put('/tasks/:id', updateTask)
routes.delete('/tasks/:id', removeTask)
routes.patch('/tasks/:id', finishedTask)

export default routes