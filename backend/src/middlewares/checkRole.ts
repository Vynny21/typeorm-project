import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { User } from '../entity/User'

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Get the user ID from previous middleware
    const id = res.locals.jwtPayload.userId 

    // Get user role from the database
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch {
      return res.status(401).json({ denied: 'User not found'})
    }

    // Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1) next()
    else return res.status(401).json({ denied: 'user does not have permission'})
  }
}