/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { User } from '../entity/User'

class UserController {
    static listAll = async (req: Request, res: Response) => {
      // Get users from database
      const userRepository = getRepository(User)

      const users = await userRepository.find({
        select: ['id', 'username', 'role', 'created_at', 'updated_at'],
        relations: ['profile', 'task'] // We dont want to send the passwords on response
      })

      // Send the users object
      return res.send(users)
    }

    static getOneById = async (req: Request, res: Response) => {
      // Get the ID from the url
      const id = req.params.id
      const user = new User()

      // Get the profile user from database
      // Query Builder
      try {
        const userRepo = getRepository(User)

        const user = await userRepo.find({
          select: ['id', 'username', 'password', 'email', 'role', 'created_at', 'updated_at'],
          relations: ['profile', 'task']
        })

        if (!user) {
          return res.status(404).json({ error: 'User not found.' })
        }

        // Returning a single user
        return res.status(200).json(user)
      } catch (error) {
        return res.status(404).send('User not found')
      }
    }

    static newUser = async (req: Request, res: Response) => {
      // Get the ID from the url
      const id = req.params.id

      // Get parameters from the body
      const { username, password, email, role } = req.body
      const user = new User()
      user.username = username
      user.password = password
      user.email = email
      user.role = role

      // Hash the password, to securely store on DB
      user.hashPassword()

      // Try to save. If fails, the username is already in use
      const userRepository = getRepository(User)
      try {
        const userID = await userRepository.findOne(id)
        if (!userID) {
          await userRepository.save(user)
        }
      } catch (e) {
        return res.status(409).send('Username already in use:' + e)
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
        return res.status(404).send('User not found')
      }

      // Try to safe, if fails, that means username already in use
      try {
        await userRepository.save(user)
      } catch (e) {
        return res.status(409).send('Do not update it.')
      }
      // After all send a 204 (no content, but accepted) response
      return res.status(204).json({ message: 'User successfully updated!' })
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
      return res.json({ message: 'User successfully deleted!' })
    }
}

export default UserController
