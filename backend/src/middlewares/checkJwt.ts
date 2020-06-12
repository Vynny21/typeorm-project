/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import config from '../config/config'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the head
  const token = <string>req.headers.auth
  let jwtPayload

  // Try to validate token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret)
    res.locals.jwtPayload = jwtPayload
  } catch {
    // If token is not valid, respond with 401 (unauthorized)
    return res.status(401).json({ error: 'User unauthorized.' })
  }

  // The token is valid for 1 hour
  // We want to send a new token on every request
  const { userId, username } = jwtPayload
  const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
    expiresIn: '1hr'
  })
  res.setHeader('token', newToken)

  // Call the next middleware or controller
  next()
}
