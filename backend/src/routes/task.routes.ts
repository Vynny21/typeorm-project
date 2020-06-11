import { Router } from 'express'
import TasksController from '../controller/TasksController'

const router = Router()

router.get('/', TasksController.getTasks)
router.get('/:id', TasksController.getTask)
router.post('/', TasksController.saveTask)
router.put('/:id', TasksController.updateTask)
router.delete('/:id', TasksController.removeTask)
router.patch('/:id', TasksController.finishedTask)

export default router
