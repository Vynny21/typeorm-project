/* eslint-disable no-unused-vars */
import { getRepository } from 'typeorm'
import { Task } from '../entity/Task'
import { Request, Response } from 'express'

/* O static serve para dizer que o atributo ou método pertence à classe,
e não ao objeto. Ou seja, você consegue acessar aquele atributo/método
externamente sem precisar instanciar o objeto.
Com o static, conseguimos acessar esses atributos e método sem precisar
dar um new, pois as propriedades estáticas pertencem a classe e
não ao objeto instanciado. */

class TasksController {
  static getTasks = async (request: Request, response: Response) => {
    const tasks = await getRepository(Task).find({
      select: ['id', 'title', 'description', 'finished', 'created_at', 'updated_at'],
      relations: ['user']
    })

    if (!tasks) {
      return response.json({ error: 'Tasks not found.' })
    }

    return response.json(tasks)
  }

  static getTask = async (request: Request, response: Response) => {
    const { id } = request.params

    const task = await getRepository(Task).findOne({
      select: ['id', 'title', 'description', 'finished', 'created_at', 'updated_at'],
      relations: ['user']
    })

    return response.json(task)
  }

  static saveTask = async (request: Request, response: Response) => {
    const id = request.params.id
    const taskRepository = getRepository(Task)

    const taskId = await taskRepository.findOne(id)

    if (taskId) {
      return response.json({ error: 'Task already exist.' })
    }

    const task = await getRepository(Task).save(request.body)

    return response.json(task)
  }

  static updateTask = async (request: Request, response: Response) => {
    const { id } = request.params

    const task = await getRepository(Task).update(id, request.body)

    if (task.affected === 1) {
      const taskUpdated = await getRepository(Task).findOne(id)
      return response.json(taskUpdated)
    }

    return response.status(404).json({ error: 'Task not found.' })
  }

  static finishedTask = async (request: Request, response: Response) => {
    const { id } = request.params

    const task = await getRepository(Task).update(id, {
      finished: true
    })

    if (task.affected === 1) {
      return response.json({ message: 'Task finished!' })
    }

    return response.status(404).json({ error: 'Task not found.' })
  }

  static removeTask = async (request: Request, response: Response) => {
    const { id } = request.params

    const task = await getRepository(Task).delete(id)

    if (task.affected === 1) {
      return response.json({ message: 'Task removed!' })
    }

    return response.status(404).json({ message: 'Task not found.' })
  }
}

export default TasksController
