/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { User } from '../entity/User'
import { Task } from '../entity/Task'

class UserController {
    static listAll = async (req: Request, res: Response) => {
      // Get users from database
      const userRepository = getRepository(User)

      const users = await userRepository.find({
        select: ['id', 'username', 'role'],
        relations: ['profile', 'task'] // We dont want to send the passwords on response
      })

      // Send the users object
      return res.send(users)
    }

    static getOneById = async (req: Request, res: Response) => {
      // Get the ID from the url
      const id = req.params.id

      // Get the profile user from database
      // Query Builder
      try {
        const user = getRepository(User)
          .createQueryBuilder('user')
          .leftJoinAndMapMany('user.profile', 'profile', 'user.task', 'task')
          .getOne()

        // Returning a single user
        return res.status(200).json(user)
      } catch (error) {
        return res.status(404).send('User not found')
      }
    }

    static newUser = async (req: Request, res: Response) => {
      // Get parameters from the body
      const { username, password, role } = req.body
      const user = new User()
      user.username = username
      user.password = password
      user.role = role

      // Validade if the parameters are ok
      const errors = await validate(user)
      if (errors.length > 0) {
        return res.status(400).send(errors)
      }

      // Hash the password, to securely store on DB
      user.hashPassword()

      // Try to save. If fails, the username is already in use
      const userRepository = getRepository(User)
      try {
        await userRepository.save(user)
      } catch (e) {
        return res.status(409).send('Username already in use')
      }

      // If all ok, send 201 response
      res.status(201).json({ message: 'User successfully created!' })
    }

    static updateUser = async (req: Request, res: Response) => {
      // Get the ID from the url
      const id = req.params.id

      // Get values from the body
      const { username, role } = req.body

      // Try to find user on database
      const userRepository = getRepository(User)
      let user
      try {
        user = await userRepository.findOneOrFail(id, { relations: ['profile', 'tasks'] })
      } catch (error) {
        // If not found, send a 404 response
        res.status(404).send('User not found')
        return
      }

      // Validate the new values on model
      user.username = username
      user.role = role
      const errors = await validate(user)
      if (errors.length > 0) {
        return res.status(400).send(errors)
      }

      // Try to safe, if fails, that means username already in use
      try {
        await userRepository.save(user)
      } catch (e) {
        return res.status(409).send('Username already in use')
      }
      // After all send a 204 (no content, but accepted) response
      res.status(204).json({ message: 'User successfully updated!' })
    }

    static deleteUser = async (req: Request, res: Response) => {
      // Get the ID from the url
      const id = req.params.id

      const userRepository = getRepository(User)

      let user: User
      try {
        user = await userRepository.findOneOrFail(id, { relations: ['profile', 'task'] })
      } catch (error) {
        return res.status(404).send('User not found')
      }
      userRepository.delete(id)

      // After all send a 204 (no content, but accepted) response
      return res.status(204).json({ message: 'User successfully deleted!' })
    }
}

export default UserController
