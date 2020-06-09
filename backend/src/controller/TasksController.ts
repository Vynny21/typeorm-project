import { getRepository } from 'typeorm'
import { Tasks } from '../entity/Tasks'
import { Request, Response } from 'express'

/* O static serve para dizer que o atributo ou método pertence à classe, 
e não ao objeto. Ou seja, você consegue acessar aquele atributo/método 
externamente sem precisar instanciar o objeto.
Com o static, conseguimos acessar esses atributos e método sem precisar 
dar um new, pois as propriedades estáticas pertencem a classe e 
não ao objeto instanciado. */

class TasksController {

  static getTasks = async (request: Request, response: Response) => {
    const tasks = await getRepository(Tasks).find()

    if(!tasks) {
      return response.json({ error: 'Tasks not found.' })
    }
  
    return response.json(tasks)
  }
  
  static getTask = async (request: Request, response: Response) => {
    const { id } = request.params
    const task = await getRepository(Tasks).findOne(id)
  
    return response.json(task)
  }
  
  static saveTask = async (request: Request, response: Response) => {
    const task = await getRepository(Tasks).save(request.body)
  
    return response.json(task)
  }
  
  static updateTask = async (request: Request, response: Response) => {
    const { id } = request.params
  
    const task = await getRepository(Tasks).update(id, request.body)
  
    if(task.affected === 1) {
      const taskUpdated = await getRepository(Tasks).findOne(id)
      return response.json(taskUpdated)
    }
  
    return response.status(404).json({ error: 'Task not found.' })
  }
  
  static finishedTask = async (request: Request, response: Response) => {
    const { id } = request.params
  
    const task = await getRepository(Tasks).update(id, {
      finished: true
    })
  
    if(task.affected === 1) {
      return response.json({ message: 'Task finished!' })
    }
  
    return response.status(404).json({ error: 'Task not found.' })
  }
  
  static removeTask = async (request: Request, response: Response) => {
    const { id } = request.params
  
    const task = await getRepository(Tasks).delete(id)
  
    if(task.affected === 1) {
      return response.json({ message: 'Task removed!' })
    }
  
    return response.status(404).json({ message: 'Task not found.' })
  }
}

export default TasksController