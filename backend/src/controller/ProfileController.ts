/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { Profile } from '../entity/Profile'

class ProfileController {
    static listAll = async (req: Request, res: Response) => {
      // Get users from database
      const profileRepository = getRepository(Profile)

      const userProfile = await profileRepository.find({
        select: ['id', 'phone', 'whatsapp', 'address', 'zipcode'],
        relations: ['user'] // We dont want to send the passwords on response
      })

      // Send the users object
      return res.send(userProfile)
    }

    static getOneById = async (req: Request, res: Response) => {
      // Get the ID from the url
      const id = req.params.id

      // Get the profile user from database
      // Query Builder
      try {
        const userProfile = getRepository(Profile)

        const profileRepository = await userProfile.findOne({
          select: ['id', 'phone', 'whatsapp', 'address', 'zipcode'],
          relations: ['user']
        })

        // Returning a single user
        return res.status(200).json(profileRepository)
      } catch (error) {
        return res.status(404).send('User not found')
      }
    }

    static saveProfile = async (request: Request, response: Response) => {
      const id = request.body
      const profileRepository = getRepository(Profile)

      const profileId = await profileRepository.findOne(id)

      if (profileId) {
        return response.json({ error: 'Task already exist.' })
      }

      const profile = await getRepository(Profile).save(request.body)

      return response.json(profile)
    }

    static updateProfile = async (req: Request, res: Response) => {
      // Get the ID from the url
      const id = req.params.id

      // Get values from the body
      const { phone, whatsapp, address, zipcode } = req.body

      // Try to find user on database
      const userRepository = getRepository(Profile)
      let userProfile
      try {
        userProfile = await userRepository.findOneOrFail(id)
      } catch (error) {
        // If not found, send a 404 response
        res.status(404).send('User not found')
        return
      }

      // Validate the new values on model
      userProfile.username = phone
      userProfile.whatsapp = whatsapp
      userProfile.address = address
      userProfile.zipcode = zipcode
      const errors = await validate(userProfile)
      if (errors.length > 0) {
        return res.status(400).send(errors)
      }

      // Try to safe, if fails, that means username already in use
      try {
        await userRepository.save(userProfile)
      } catch (e) {
        return res.status(409).send('Username already in use')
      }
      // After all send a 204 (no content, but accepted) response
      res.status(204).json({ message: 'User successfully updated!' })
    }

    static deleteProfile = async (req: Request, res: Response) => {
      // Get the ID from the url
      const id = req.params.id

      const userRepository = getRepository(Profile)
      let userProfile: Profile
      try {
        userProfile = await userRepository.findOneOrFail(id)
      } catch (error) {
        res.status(404).send('User not found')
        return
      }
      userRepository.delete(id)

      // After all send a 204 (no content, but accepted) response
      return res.json({ message: 'User successfully deleted!' })
    }
}

export default ProfileController
